import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { User, Calendar, LogOut, Settings, Search } from "lucide-react";

export default function BookingsPage() {
  return (<>
    <Header />
    <main className="flex-1">
      <section className="py-12 bg-cream"><div className="container">
        <p className="overline mb-2 text-muted">My Account</p>
        <h1 className="text-3xl text-charcoal">My Bookings</h1>
      </div></section>

      <section className="section-sm"><div className="container max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {[{ label: "Profile", href: "/account", icon: User }, { label: "My Bookings", href: "/account/bookings", icon: Calendar, active: true }, { label: "Settings", href: "/account", icon: Settings }].map((item) => (
                <Link key={item.label} href={item.href} className={"flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors " + (item.active ? "bg-cream text-charcoal font-medium" : "text-muted hover:text-charcoal hover:bg-cream/50")}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              ))}
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted hover:text-red-600 w-full"><LogOut className="w-4 h-4" /> Sign Out</button>
            </nav>
          </div>
          <div className="md:col-span-2">
            {/* Lookup by confirmation code */}
            <div className="bg-card border border-border-light rounded-lg p-6 mb-6">
              <h3 className="text-lg mb-4">Find a Booking</h3>
              <div className="flex gap-3">
                <input type="text" placeholder="Confirmation code (e.g. TM-A1B2C3D4)" className="form-input flex-1" />
                <button className="btn btn-primary"><Search className="w-4 h-4 mr-1" /> Look Up</button>
              </div>
            </div>

            {/* Empty state */}
            <div className="bg-card border border-border-light rounded-lg p-12 text-center">
              <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg mb-2">No bookings yet</h3>
              <p className="text-muted text-sm mb-6">Your reservations will appear here once you book a room.</p>
              <Link href="/rooms" className="btn btn-primary">Browse Rooms</Link>
            </div>

            <div className="mt-6 p-6 bg-cream rounded-lg text-center">
              <p className="text-muted text-sm">Connect to Supabase to enable persistent booking history.</p>
            </div>
          </div>
        </div>
      </div></section>
    </main>
    <Footer />
  </>);
}
