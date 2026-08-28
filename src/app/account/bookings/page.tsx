"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { User, Calendar, LogOut, Settings, Search, Loader2 } from "lucide-react";

export default function BookingsPage() {
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!code.trim()) { setError("Please enter a confirmation code."); return; }
    setLoading(true); setError(""); setBooking(null);
    try {
      const res = await fetch("/api/bookings?confirmation_code=" + code.trim());
      const data = await res.json();
      if (data.bookings && data.bookings.length > 0) { setBooking(data.bookings[0]); }
      else { setError("No booking found with this code."); }
    } catch { setError("Could not look up booking."); }
    finally { setLoading(false); }
  };

  return (<><Header /><main className="flex-1">
    <section className="py-12 bg-cream"><div className="container">
      <p className="overline mb-2 text-muted">My Account</p>
      <h1 className="text-3xl text-charcoal">My Bookings</h1>
    </div></section>
    <section className="section-sm"><div className="container max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1"><nav className="space-y-1">
          {[{ label: "Profile", href: "/account", icon: User }, { label: "My Bookings", href: "/account/bookings", icon: Calendar, active: true }, { label: "Settings", href: "/account", icon: Settings }].map((item) => (<Link key={item.label} href={item.href} className={"flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors " + (item.active ? "bg-cream text-charcoal font-medium" : "text-muted hover:text-charcoal hover:bg-cream/50")}><item.icon className="w-4 h-4" /> {item.label}</Link>))}
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted hover:text-red-600 w-full"><LogOut className="w-4 h-4" /> Sign Out</button>
        </nav></div>
        <div className="md:col-span-2">
          <div className="bg-card border border-border-light rounded-lg p-6 mb-6">
            <h3 className="text-lg mb-4">Find a Booking</h3>
            <div className="flex gap-3">
              <input type="text" placeholder="Confirmation code (e.g. TM-A1B2C3D4)" value={code} onChange={(e) => setCode(e.target.value)} className="form-input flex-1" />
              <button className="btn btn-primary" onClick={lookup} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center"><Search className="w-4 h-4 mr-1" /> Look Up</span>}</button>
            </div>
          </div>
          {error && <div className="mb-6 p-4 rounded-lg text-sm" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>{error}</div>}
          {booking ? (
            <div className="bg-card border border-border-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-light">
                <div><p className="text-xs uppercase tracking-wider text-muted mb-1">Confirmation</p><p className="text-xl font-medium text-charcoal">{booking.confirmation_code}</p></div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: booking.status === "confirmed" ? "#E8F5E8" : "#FEF3C7", color: booking.status === "confirmed" ? "#5B8C5A" : "#92400E" }}>{booking.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ l: "Room", v: booking.rooms?.name || "N/A" }, { l: "Category", v: booking.rooms?.category || "N/A" }, { l: "Check-in", v: booking.check_in }, { l: "Check-out", v: booking.check_out }, { l: "Guests", v: booking.guests_count }, { l: "Total", v: "$" + booking.total_price }].map((r, i) => <div key={i}><p className="text-xs uppercase tracking-wider text-muted mb-1">{r.l}</p><p className="font-medium text-charcoal">{r.v}</p></div>)}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border-light rounded-lg p-12 text-center">
              <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg mb-2">No bookings yet</h3>
              <p className="text-muted text-sm mb-6">Enter your confirmation code above or browse rooms to make a reservation.</p>
              <Link href="/rooms" className="btn btn-primary">Browse Rooms</Link>
            </div>
          )}
        </div>
      </div>
    </div></section>
  </main><Footer /></>);
}
