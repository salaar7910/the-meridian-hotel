import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured.");
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Check if any admin already exists
  const { data: existingAdmins } = await supabase
    .from("guests")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  // If admins exist, require the caller to be an admin
  if (existingAdmins && existingAdmins.length > 0) {
    // Verify caller is admin via cookie-based auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
    }
  }

  // Promote the user
  const { data: guest, error } = await supabase
    .from("guests")
    .update({ role: "admin" })
    .eq("email", email)
    .select("id, email, first_name, last_name, role")
    .single();

  if (error || !guest) {
    return NextResponse.json({ error: "Guest not found with this email" }, { status: 404 });
  }

  return NextResponse.json({
    message: `${guest.first_name} ${guest.last_name} is now an admin`,
    guest,
  });
}
