"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Lock, Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use XMLHttpRequest instead of fetch — it handles Set-Cookie from redirects natively
      const result = await new Promise<{ success: boolean; error?: string }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/auth");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true; // Include cookies
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 303 || xhr.status === 302 || xhr.status === 301) {
              // Got redirect — cookies are set, navigate to admin
              resolve({ success: true });
            } else if (xhr.status === 200) {
              resolve({ success: true });
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({ success: false, error: data.error });
              } catch {
                resolve({ success: false, error: "Login failed" });
              }
            }
          }
        };
        xhr.send(JSON.stringify({ email, password }));
      });

      if (result.success) {
        // Force full page reload to /admin — this ensures cookies are sent
        window.location.href = "/admin";
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    } catch (err: any) {
      // If redirect happened, just navigate
      window.location.href = "/admin";
    }
  };

  return (
    <>
      <Header />
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--color-cream)" }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: "var(--color-charcoal)",
                color: "var(--color-cream)",
              }}
            >
              <Shield size={28} />
            </div>
            <h1
              className="text-3xl font-light"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-charcoal)",
              }}
            >
              Admin Access
            </h1>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-stone)" }}
            >
              Enter the admin password to gain access
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--color-border)",
            }}
          >
            {error && (
              <div
                className="p-4 text-sm rounded-lg"
                style={{
                  background: "#fef2f2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-xs tracking-[0.15em] uppercase mb-2"
                style={{ color: "var(--color-stone)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
                style={{
                  borderColor: "var(--color-border)",
                  background: "white",
                  color: "var(--color-charcoal)",
                }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-[0.15em] uppercase mb-2"
                style={{ color: "var(--color-stone)" }}
              >
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
                style={{
                  borderColor: "var(--color-border)",
                  background: "white",
                  color: "var(--color-charcoal)",
                }}
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Enter Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs tracking-[0.1em] uppercase"
              style={{ color: "var(--color-stone)" }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
