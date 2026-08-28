import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase not configured");
  return createClient(url, key);
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_images(*), room_highlights(*), rates(*)")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rooms: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, slug, category, short_description, description, size_sqm, size_sqft, max_guests, bed_type, view_type, floor_info } = body;
  if (!name || !slug || !category) {
    return NextResponse.json({ error: "name, slug, and category are required" }, { status: 400 });
  }
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("rooms")
    .insert({ name, slug, category, short_description, description, size_sqm, size_sqft, max_guests, bed_type, view_type, floor_info })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ room: data }, { status: 201 });
}
