import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

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
    .select("id, email, role")
    .eq("email", email)
    .single();

  if (!guest) {
    const emailName = email.split("@")[0];
    const { data: newGuest } = await supabase
      .from("guests")
      .insert({ email, first_name: emailName, last_name: "", role: "admin" })
      .select("id, email, role")
      .single();
    guest = newGuest;
  } else if (guest.role !== "admin") {
    const { data: updated } = await supabase
      .from("guests")
      .update({ role: "admin" })
      .eq("id", guest.id)
      .select("id, email, role")
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

  // 3. Create redirect response FIRST, then let SSR client write cookies to it
  const redirectResponse = NextResponse.redirect(new URL("/admin", request.url), 303);

  // Detect if we're on localhost (HTTP) — Secure flag breaks cookies on non-HTTPS
  const isLocalhost = request.url.includes('localhost');
  const supabaseSSR = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          redirectResponse.cookies.set(name, value, {
            ...options,
            secure: isLocalhost ? false : (options?.secure ?? true),
          });
        });
      },
    },
  });

  const { error: signInError } = await supabaseSSR.auth.signInWithPassword({
    email,
    password: authPassword,
  });

  if (signInError) {
    return NextResponse.json({ error: "Could not sign in: " + signInError.message }, { status: 500 });
  }

  // 4. Return the redirect response — cookies are set via setAll above
  return redirectResponse;
}
