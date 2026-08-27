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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { guest_email, first_name, last_name, phone, room_id, rate_id, check_in, check_out, guests_count, special_requests, extras } = body;

  if (!guest_email || !first_name || !last_name || !room_id || !rate_id || !check_in || !check_out) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabase();

  // 1. Check availability
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", room_id)
    .in("status", ["confirmed", "pending"])
    .lt("check_in", check_out)
    .gt("check_out", check_in);

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({ error: "Room is not available for these dates" }, { status: 409 });
  }

  // 2. Get rate price
  const { data: rate } = await supabase
    .from("rates")
    .select("base_price")
    .eq("id", rate_id)
    .single();

  if (!rate) {
    return NextResponse.json({ error: "Invalid rate" }, { status: 400 });
  }

  // 3. Calculate nights and total
  const nights = Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 60 * 60 * 24));
  const extrasTotal = extras ? extras.reduce((sum: number, e: { price: number; quantity?: number }) => sum + e.price * (e.quantity || 1), 0) : 0;
  const totalPrice = rate.base_price * nights + extrasTotal;

  // 4. Upsert guest
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .upsert({ email: guest_email, first_name, last_name, phone }, { onConflict: "email" })
    .select("id")
    .single();

  if (guestError || !guest) {
    return NextResponse.json({ error: "Could not create guest" }, { status: 500 });
  }

  // 5. Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      guest_id: guest.id,
      room_id, rate_id, check_in, check_out,
      guests_count: guests_count || 1,
      total_price: totalPrice,
      special_requests,
      status: "confirmed",
    })
    .select("id, confirmation_code")
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Could not create booking" }, { status: 500 });
  }

  // 6. Add extras if any
  if (extras && extras.length > 0) {
    await supabase.from("booking_extras").insert(
      extras.map((e: { name: string; price: number; quantity?: number }) => ({
        booking_id: booking.id, name: e.name, price: e.price, quantity: e.quantity || 1,
      }))
    );
  }

  return NextResponse.json({
    booking_id: booking.id,
    confirmation_code: booking.confirmation_code,
    total_price: totalPrice,
    nights,
    message: "Booking confirmed",
  }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get("guest_id");
  const code = searchParams.get("confirmation_code");

  const supabase = getSupabase();

  let data: any;
  let error: any;

  if (code) {
    const result = await supabase.from("bookings").select("*, rooms(name, slug, category), rates(name, base_price), guests(first_name, last_name, email)").eq("confirmation_code", code).single();
    data = result.data;
    error = result.error;
  } else if (guestId) {
    const result = await supabase.from("bookings").select("*, rooms(name, slug, category), rates(name, base_price), guests(first_name, last_name, email)").eq("guest_id", guestId).order("created_at", { ascending: false });
    data = result.data;
    error = result.error;
  } else {
    return NextResponse.json({ error: "Provide guest_id or confirmation_code" }, { status: 400 });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}
