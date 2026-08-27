"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-cream)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="text-sm tracking-[0.2em] uppercase" style={{ color: "var(--color-charcoal)" }}>
            The Meridian
          </Link>
          <h1 className="mt-8 text-4xl font-light" style={{ fontFamily: "var(--font-serif)", color: "var(--color-charcoal)" }}>
            Welcome Back
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-stone)" }}>
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 text-sm rounded-lg" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-stone)" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-stone)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "var(--color-stone)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline" style={{ color: "var(--color-charcoal)" }}>
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs tracking-[0.1em] uppercase" style={{ color: "var(--color-stone)" }}>
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
