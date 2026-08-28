"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Create a hidden form and submit it to the server action
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/admin/callback/set-session";

      const atInput = document.createElement("input");
      atInput.type = "hidden";
      atInput.name = "access_token";
      atInput.value = accessToken;
      form.appendChild(atInput);

      const rtInput = document.createElement("input");
      rtInput.type = "hidden";
      rtInput.name = "refresh_token";
      rtInput.value = refreshToken;
      form.appendChild(rtInput);

      document.body.appendChild(form);
      form.submit();
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
