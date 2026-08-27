import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { User, Calendar, LogOut, Settings } from "lucide-react";

export default function AccountPage() {
  return (<>
    <Header />
    <main className="flex-1">
      <section className="py-12 bg-cream"><div className="container">
        <p className="overline mb-2 text-muted">My Account</p>
        <h1 className="text-3xl text-charcoal">Welcome Back</h1>
      </div></section>

      <section className="section-sm"><div className="container max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {[{ label: "Profile", href: "/account", icon: User, active: true }, { label: "My Bookings", href: "/account/bookings", icon: Calendar }, { label: "Settings", href: "/account", icon: Settings }].map((item) => (
                <Link key={item.label} href={item.href} className={"flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors " + (item.active ? "bg-cream text-charcoal font-medium" : "text-muted hover:text-charcoal hover:bg-cream/50")}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              ))}
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted hover:text-red-600 w-full"><LogOut className="w-4 h-4" /> Sign Out</button>
            </nav>
          </div>
          <div className="md:col-span-2">
            <div className="bg-card border border-border-light rounded-lg p-8">
              <h2 className="text-xl mb-6">Personal Information</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" defaultValue="" /></div>
                  <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" defaultValue="" /></div>
                </div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" defaultValue="" /></div>
                <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" defaultValue="" /></div>
                <button type="button" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
            <div className="mt-6 p-6 bg-cream rounded-lg text-center">
              <p className="text-muted text-sm">Connect to Supabase to enable authentication and persistent user profiles.</p>
            </div>
          </div>
        </div>
      </div></section>
    </main>
    <Footer />
  </>);
}
