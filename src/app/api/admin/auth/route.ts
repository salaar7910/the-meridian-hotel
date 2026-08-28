import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const { password, email } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin access not configured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Try to find existing guest
  let { data: guest } = await supabase
    .from("guests")
    .select("id, email, first_name, last_name, role")
    .eq("email", email)
    .single();

  // If no guest exists, create one as admin
  if (!guest) {
    const emailName = email.split("@")[0];
    const { data: newGuest, error } = await supabase
      .from("guests")
      .insert({
        email,
        first_name: emailName,
        last_name: "",
        role: "admin",
      })
      .select("id, email, first_name, last_name, role")
      .single();

    if (error) {
      return NextResponse.json({ error: "Could not create admin account" }, { status: 500 });
    }
    guest = newGuest;
  } else {
    // Promote existing guest to admin
    const { data: updated } = await supabase
      .from("guests")
      .update({ role: "admin" })
      .eq("id", guest.id)
      .select("id, email, first_name, last_name, role")
      .single();
    if (updated) guest = updated;
  }

  return NextResponse.json({
    message: "Admin access granted",
    guest,
  });
}
