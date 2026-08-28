import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const accessToken = formData.get("access_token") as string;
  const refreshToken = formData.get("refresh_token") as string;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Extract project ref from URL
  const projectRef = supabaseUrl.replace("https://", "").replace(".supabase.co", "");
  const cookieName = `sb-${projectRef}-auth-token`;

  // Build the session object that @supabase/ssr expects
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
