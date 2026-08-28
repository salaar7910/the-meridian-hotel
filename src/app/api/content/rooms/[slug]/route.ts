import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase not configured.");
  return createClient(url, key);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*, room_images(id, src, alt, caption, sort_order, is_primary), room_highlights(id, text, sort_order), amenity_groups(id, group_name, sort_order, amenity_items(id, item_text, sort_order)), rates(id, name, description, base_price, currency, cancellation_policy, is_active)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !room) {
    return NextResponse.json({ error: "Room not found", details: error?.message }, { status: 404 });
  }

  // Compute starting_price from lowest rate
  const activeRates = (room.rates || []).filter((r: any) => r.is_active);
  room.starting_price = activeRates.length > 0 ? Math.min(...activeRates.map((r: any) => r.base_price)) : 0;

  // Sort relations
  if (room.amenity_groups) {
    room.amenity_groups.sort((a: any, b: any) => a.sort_order - b.sort_order);
    room.amenity_groups.forEach((group: any) => {
      if (group.amenity_items) group.amenity_items.sort((a: any, b: any) => a.sort_order - b.sort_order);
    });
  }
  if (room.room_highlights) room.room_highlights.sort((a: any, b: any) => a.sort_order - b.sort_order);
  if (room.room_images) room.room_images.sort((a: any, b: any) => a.sort_order - b.sort_order);

  const { data: relatedRooms } = await supabase
    .from("rooms")
    .select("id, name, slug, category, short_description, size_sqm, max_guests, bed_type, view_type")
    .eq("is_active", true)
    .neq("id", room.id)
    .limit(3);

  // Add starting_price to related rooms
  if (relatedRooms) {
    for (const rr of relatedRooms) {
      const { data: rrRates } = await supabase.from("rates").select("base_price").eq("room_id", rr.id).eq("is_active", true);
      rr.starting_price = rrRates && rrRates.length > 0 ? Math.min(...rrRates.map((r: any) => r.base_price)) : 0;
    }
  }

  return NextResponse.json({ room, relatedRooms: relatedRooms || [] });
}
