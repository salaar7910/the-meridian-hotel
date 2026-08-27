import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("room_id");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");

  if (!roomId || !checkIn || !checkOut) {
    return NextResponse.json({ error: "room_id, check_in, and check_out are required" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Check for overlapping bookings
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .in("status", ["confirmed", "pending"])
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  const available = !conflicts || conflicts.length === 0;
  return NextResponse.json({ available, conflicts: conflicts?.length || 0 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { room_id, check_in, check_out, guests_count } = body;

  if (!room_id || !check_in || !check_out) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Get all rooms and check availability
  const { data: allRooms } = await supabase
    .from("rooms")
    .select("id, name")
    .eq("is_active", true);

  if (!allRooms) {
    return NextResponse.json({ error: "Could not fetch rooms" }, { status: 500 });
  }

  // Filter by requested room type if specified
  const roomsToCheck = room_id ? allRooms.filter((r) => r.id === room_id) : allRooms;

  const availableRooms = [];
  for (const room of roomsToCheck) {
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", room.id)
      .in("status", ["confirmed", "pending"])
      .lt("check_in", check_out)
      .gt("check_out", check_in);

    if (!conflicts || conflicts.length === 0) {
      availableRooms.push(room);
    }
  }

  return NextResponse.json({ availableRooms, count: availableRooms.length });
}
