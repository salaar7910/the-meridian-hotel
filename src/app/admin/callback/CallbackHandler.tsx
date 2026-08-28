"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Navigate to set-session route which sets the cookie and redirects to /admin
      const params = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      window.location.href = "/admin/callback/set-session?" + params.toString();
    } else {
      window.location.href = "/admin/login";
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted">Signing you in...</p>
    </div>
  );
}
