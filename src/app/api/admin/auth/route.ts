import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  let email: string, password: string;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } else {
    const formData = await request.formData();
    email = formData.get("email") as string;
    password = formData.get("password") as string;
  }

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, serviceKey);

  // 1. Find or create guest with admin role
  let { data: guest } = await supabase
    .from("guests")
    .select("id, email, first_name, last_name, role")
    .eq("email", email)
    .single();

  if (!guest) {
    const emailName = email.split("@")[0];
    const { data: newGuest } = await supabase
      .from("guests")
      .insert({ email, first_name: emailName, last_name: "", role: "admin" })
      .select("id, email, first_name, last_name, role")
      .single();
    guest = newGuest;
  } else if (guest.role !== "admin") {
    const { data: updated } = await supabase
      .from("guests")
      .update({ role: "admin" })
      .eq("id", guest.id)
      .select("id, email, first_name, last_name, role")
      .single();
    if (updated) guest = updated;
  }

  if (!guest) {
    return NextResponse.json({ error: "Could not create admin account" }, { status: 500 });
  }

  // 2. Create or update Supabase auth user
  const authPassword = "admin-" + Date.now();

  try {
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: authPassword,
      email_confirm: true,
    });
    if (createError) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users?.find((u) => u.email === email);
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password: authPassword });
      }
    }
  } catch {
    // Continue
  }

  // 3. Sign in and get tokens
  const anonSupabase = createClient(supabaseUrl, anonKey);
  const { data: sessionData, error: sessionError } = await anonSupabase.auth.signInWithPassword({
    email,
    password: authPassword,
  });

  if (sessionError || !sessionData.session) {
    return NextResponse.json({ error: "Could not create login session" }, { status: 500 });
  }

  // 4. Return JSON — client will navigate via window.location
  const accessToken = sessionData.session.access_token;
  const refreshToken = sessionData.session.refresh_token;

  return NextResponse.json({
    success: true,
    access_token: accessToken,
    refresh_token: refreshToken,
    redirect: "/admin/callback",
  });
}
