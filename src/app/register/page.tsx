"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create guest profile
    if (data.user) {
      await supabase.from("guests").insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      });
    }

    router.push("/account");
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
            Create Account
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-stone)" }}>
            Join The Meridian for a personalized experience
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="p-4 text-sm rounded-lg" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-stone)" }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
                style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-stone)" }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
                style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }}
              />
            </div>
          </div>

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
              minLength={8}
              className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }}
              placeholder="Minimum 8 characters"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "var(--color-stone)" }}>
            Already have an account?{" "}
            <Link href="/login" className="underline" style={{ color: "var(--color-charcoal)" }}>
              Sign in
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
