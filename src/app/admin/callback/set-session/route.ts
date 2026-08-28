import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get("access_token");
  const refreshToken = request.nextUrl.searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const projectRef = supabaseUrl.replace("https://", "").replace(".supabase.co", "");
  const cookieName = `sb-${projectRef}-auth-token`;

  // Build the correct JSON structure
  const now = Math.floor(Date.now() / 1000);
  const sessionData = {
    access_token: accessToken,
    refresh_token: refreshToken,
    provider_token: null,
    provider_refresh_token: null,
    expires_at: now + 3600,
    expires_in: 3600,
    token_type: "bearer",
    user: null,
  };

  // Encode as base64url (not base64)
  const jsonStr = JSON.stringify(sessionData);
  const base64 = Buffer.from(jsonStr).toString("base64");
  const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  // Supabase SSR splits large cookies into chunks of ~3500 chars
  const CHUNK_SIZE = 3500;
  const response = NextResponse.redirect(new URL("/admin", request.url));

  if (base64url.length <= CHUNK_SIZE) {
    response.cookies.set(cookieName, base64url, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    // Split into chunks
    const chunks = Math.ceil(base64url.length / CHUNK_SIZE);
    for (let i = 0; i < chunks; i++) {
      const chunk = base64url.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      response.cookies.set(`${cookieName}.${i}`, chunk, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }

  return response;
}
