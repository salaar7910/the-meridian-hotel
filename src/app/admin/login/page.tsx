"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Lock, Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Verify admin password and create/promote account
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Admin access granted! Signing you in...");

      // Step 2: Sign in via Supabase Auth so middleware lets us through
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (data.authPassword) {
        // Sign in with the token the API created
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: data.authPassword,
        });
        if (signInError) {
          // Fallback: try signup + signin
          await supabase.auth.signUp({ email, password: data.authPassword }).catch(() => {});
          await supabase.auth.signInWithPassword({ email, password: data.authPassword }).catch(() => {});
        }
      }

      setTimeout(() => router.push("/admin"), 1000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (<><Header /><main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-cream)" }}>
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--color-charcoal)", color: "var(--color-cream)" }}><Shield size={28} /></div>
        <h1 className="text-3xl font-light" style={{ fontFamily: "var(--font-serif)", color: "var(--color-charcoal)" }}>Admin Access</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--color-stone)" }}>Enter the admin password to gain access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" style={{ background: "white", padding: "2rem", borderRadius: "0.75rem", border: "1px solid var(--color-border)" }}>
        {error && <div className="p-4 text-sm rounded-lg" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>{error}</div>}
        {success && <div className="p-4 text-sm rounded-lg" style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>{success}</div>}

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-stone)" }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1" style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }} placeholder="your@email.com" />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-stone)" }}>Admin Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1" style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }} placeholder="Enter admin password" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <><Lock className="w-4 h-4" /> Enter Admin Panel</>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs tracking-[0.1em] uppercase" style={{ color: "var(--color-stone)" }}>Return to Home</Link>
      </div>
    </div>
  </main><Footer /></>);
}
