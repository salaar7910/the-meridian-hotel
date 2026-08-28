import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase not configured");
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const { booking_id } = await request.json();
  if (!booking_id) {
    return NextResponse.json({ error: "booking_id is required" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Fetch booking with related data
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, rooms(name, slug, category), rates(name, base_price), guests(first_name, last_name, email)")
    .eq("id", booking_id)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Build email content (in production, send via Resend/SendGrid)
  const emailContent = {
    to: booking.guests?.email,
    subject: `Booking Confirmed - ${booking.rooms?.name} | The Meridian`,
    html: `
      <h1>Your booking is confirmed</h1>
      <p>Dear ${booking.guests?.first_name},</p>
      <p>Thank you for choosing The Meridian. Your reservation has been confirmed.</p>
      <h2>Booking Details</h2>
      <p><strong>Confirmation Code:</strong> ${booking.confirmation_code}</p>
      <p><strong>Room:</strong> ${booking.rooms?.name} (${booking.rooms?.category})</p>
      <p><strong>Check-in:</strong> ${booking.check_in}</p>
      <p><strong>Check-out:</strong> ${booking.check_out}</p>
      <p><strong>Guests:</strong> ${booking.guests_count}</p>
      <p><strong>Total:</strong> $${booking.total_price} ${booking.currency}</p>
      <p>We look forward to welcoming you.</p>
      <p>Best regards,<br/>The Meridian</p>
    `
  };

  // In production, integrate with email service:
  // await resend.emails.send(from, to, subject, html);

  console.log("Booking confirmation email:", emailContent);

  return NextResponse.json({
    message: "Booking confirmation email sent",
    booking_id: booking.id,
    confirmation_code: booking.confirmation_code,
    email: emailContent,
  });
}
