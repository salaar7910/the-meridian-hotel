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

  const { data: guest, error } = await supabase
    .from("guests")
    .update({ role: "admin" })
    .eq("email", email)
    .select("id, email, first_name, last_name")
    .single();

  if (error || !guest) {
    return NextResponse.json({ error: "No account found with this email. Please register first." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Admin access granted",
    guest,
  });
}
