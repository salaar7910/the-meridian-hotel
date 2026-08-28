import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase not configured");
  return createClient(url, key);
}

export async function GET() {
  const supabase = getSupabase();
  const [rooms, bookings, guests] = await Promise.all([
    supabase.from("rooms").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("guests").select("id", { count: "exact", head: true }),
  ]);
  return NextResponse.json({
    totalRooms: rooms.count || 0,
    totalBookings: bookings.count || 0,
    totalGuests: guests.count || 0,
  });
}
