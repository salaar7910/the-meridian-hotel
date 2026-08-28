import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return createClient(url, key);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data: room, error } = await supabase
    .from('rooms')
    .select('*, room_images(id, image_url, alt_text, caption, sort_order), room_highlights(id, highlight_text, sort_order), amenity_groups(id, group_name, sort_order, amenity_items(id, item_name, sort_order)), rates(id, name, description, base_price, cancellation_policy, is_active, rate_includes)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  if (room.amenity_groups) {
    room.amenity_groups.sort((a: any, b: any) => a.sort_order - b.sort_order);
    room.amenity_groups.forEach((group: any) => {
      if (group.amenity_items) {
        group.amenity_items.sort((a: any, b: any) => a.sort_order - b.sort_order);
      }
    });
  }
  if (room.room_highlights) room.room_highlights.sort((a: any, b: any) => a.sort_order - b.sort_order);
  if (room.room_images) room.room_images.sort((a: any, b: any) => a.sort_order - b.sort_order);

  const { data: relatedRooms } = await supabase
    .from('rooms')
    .select('id, name, slug, category, short_description, starting_price, size, max_guests, bed_type, view')
    .eq('is_active', true)
    .neq('id', room.id)
    .limit(3);

  return NextResponse.json({ room, relatedRooms: relatedRooms || [] });
}
