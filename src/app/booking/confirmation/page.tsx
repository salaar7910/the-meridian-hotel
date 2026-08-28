"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, Calendar, Phone, Mail } from "lucide-react";

function ConfirmationContent() {
  const sp = useSearchParams();
  const code = sp.get("code") || "TM-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const room = sp.get("room") || "Your Room";
  const ci = sp.get("checkin") || "Check-in date";
  const co = sp.get("checkout") || "Check-out date";
  const guests = sp.get("guests") || "2";
  const total = sp.get("total") || "0";
  const bookingId = sp.get("booking_id");

  useEffect(() => {
    if (bookingId) {
      fetch("/api/emails/booking-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      }).catch(() => {});
    }
  }, [bookingId]);

  return (<><Header /><main className="flex-1" style={{ background: "var(--color-cream)" }}>
    <section className="section flex items-center justify-center min-h-[70vh]">
      <div className="container-narrow max-w-2xl text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: "var(--color-gold-light)", color: "var(--color-charcoal)" }}><Check size={36} strokeWidth={2} /></div>
        <h1 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "var(--font-serif)", color: "var(--color-charcoal)" }}>Reservation Confirmed</h1>
        <p className="text-base mb-10" style={{ color: "var(--color-stone)" }}>Thank you for choosing The Meridian.</p>
          <div className="rounded-xl p-8 text-left mb-10" style={{ background: "white", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center justify-between mb-6 pb-6" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--color-stone)" }}>Confirmation Code</p>
                <p className="text-2xl font-medium" style={{ fontFamily: "var(--font-serif)", color: "var(--color-charcoal)" }}>{code}</p>
              </div>
              <div className="px-4 py-2 rounded-full text-xs font-medium" style={{ background: "#E8F5E8", color: "#5B8C5A" }}>Confirmed</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--color-stone)" }}>Room</p>
                <p className="font-medium" style={{ color: "var(--color-charcoal)" }}>{room}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--color-stone)" }}>Guests</p>
                <p className="font-medium" style={{ color: "var(--color-charcoal)" }}>{guests}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--color-stone)" }}>Check-in</p>
                <p className="font-medium" style={{ color: "var(--color-charcoal)" }}>{ci}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--color-stone)" }}>Check-out</p>
                <p className="font-medium" style={{ color: "var(--color-charcoal)" }}>{co}</p>
              </div>
            </div>
            {total !== "0" && (
              <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--color-border)" }}>
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: "var(--color-stone)" }}>Total</p>
                <p className="text-2xl font-medium" style={{ fontFamily: "var(--font-serif)", color: "var(--color-charcoal)" }}>${Number(total).toLocaleString()}</p>
              </div>
            )}
          </div>
          <div className="space-y-3 text-sm mb-10" style={{ color: "var(--color-stone)" }}>
            {["A confirmation email has been sent to your email address.", "Our concierge team will reach out 48 hours before your arrival.", "Early check-in and late check-out are subject to availability.", "Special requests will be noted and confirmed where possible."].map((item, i) => (
              <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--color-gold)" }} /><span>{item}</span></div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rooms" className="btn btn-primary">Browse More Rooms</Link>
            <Link href="/" className="btn btn-outline">Return Home</Link>
          </div>
      </div>
    </section>
  </main><Footer /></>);
}

export default function BookingConfirmation() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><ConfirmationContent /></Suspense>;
}
