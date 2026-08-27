import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (<>
    <Header />
    <main className="flex-1">
      <section className="relative py-24 md:py-32 bg-cream"><div className="container text-center">
        <p className="overline mb-4 text-muted">Contact</p>
        <h1 className="text-4xl md:text-5xl mb-4 text-charcoal">Get in Touch</h1>
        <p className="editorial-text max-w-xl mx-auto text-charcoal-light">We would love to hear from you. Whether you have a question about availability, need help planning a special occasion, or simply want to learn more.</p>
      </div></section>

      <section className="section"><div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl mb-8">Send Us a Message</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" /></div>
                <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" /></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" /></div>
              <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" /></div>
              <div className="form-group"><label className="form-label">Subject</label><select className="form-select"><option>General Inquiry</option><option>Reservation Question</option><option>Special Request</option><option>Events & Weddings</option><option>Press</option></select></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-input min-h-[120px] resize-y" /></div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl mb-8">Find Us</h2>
            <div className="space-y-6">
              <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-gold" /></div><div><p className="font-medium text-charcoal">Address</p><p className="text-muted text-sm">123 Meridian Avenue<br />New York, NY 10001</p></div></div>
              <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4 text-gold" /></div><div><p className="font-medium text-charcoal">Phone</p><p className="text-muted text-sm">+1 (212) 555-0100</p></div></div>
              <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4 text-gold" /></div><div><p className="font-medium text-charcoal">Email</p><p className="text-muted text-sm">reservations@themeridian.com</p></div></div>
              <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4 text-gold" /></div><div><p className="font-medium text-charcoal">Front Desk</p><p className="text-muted text-sm">Open 24 hours, 7 days a week</p></div></div>
            </div>
            <div className="mt-10 aspect-[4/3] bg-gradient-to-br from-cream-dark to-cream rounded-lg flex items-center justify-center"><span className="text-muted text-sm">Map</span></div>
          </div>
        </div>
      </div></section>
    </main>
    <Footer />
  </>);
}
