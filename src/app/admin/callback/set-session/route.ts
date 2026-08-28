import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get("access_token");
  const refreshToken = request.nextUrl.searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.replace("https://", "").replace(".supabase.co", "");
  const cookieName = `sb-${projectRef}-auth-token`;

  const sessionObj = JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: "bearer",
  });
  const cookieValue = Buffer.from(sessionObj).toString("base64");

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(cookieName, cookieValue, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
