"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { error: "Admin access not configured" };
  }

  if (password !== adminPassword) {
    return { error: "Invalid admin password" };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // 1. Find or create guest with admin role
  const serviceSupabase = createServiceClient(supabaseUrl, serviceKey);

  let { data: guest } = await serviceSupabase
    .from("guests")
    .select("id, email, role")
    .eq("email", email)
    .single();

  if (!guest) {
    const emailName = email.split("@")[0];
    const { data: newGuest } = await serviceSupabase
      .from("guests")
      .insert({ email, first_name: emailName, last_name: "", role: "admin" })
      .select("id, email, role")
      .single();
    guest = newGuest;
  } else if (guest.role !== "admin") {
    const { data: updated } = await serviceSupabase
      .from("guests")
      .update({ role: "admin" })
      .eq("id", guest.id)
      .select("id, email, role")
      .single();
    if (updated) guest = updated;
  }

  if (!guest) {
    return { error: "Could not create admin account" };
  }

  // 2. Create or update Supabase auth user with a known password
  const authPassword = "admin-" + Date.now();

  try {
    const { error: createError } = await serviceSupabase.auth.admin.createUser({
      email,
      password: authPassword,
      email_confirm: true,
    });
    if (createError) {
      // User already exists — update their password
      const { data: users } = await serviceSupabase.auth.admin.listUsers();
      const existingUser = users?.users?.find((u) => u.email === email);
      if (existingUser) {
        await serviceSupabase.auth.admin.updateUserById(existingUser.id, {
          password: authPassword,
        });
      }
    }
  } catch {
    // Continue — we'll try signing in either way
  }

  // 3. Sign in using the SERVER client — this sets cookies via @supabase/ssr natively
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: authPassword,
  });

  if (signInError) {
    return { error: "Could not sign in: " + signInError.message };
  }

  // 4. Redirect to /admin — the cookie is already set by the server client above
  return { success: true, redirect: "/admin" };
}
