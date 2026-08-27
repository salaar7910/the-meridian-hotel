import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const wellnessServiceImages: Record<string, string> = {
  "The Spa": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop",
  "Fitness Center": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop",
  "25m Indoor Pool": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80&auto=format&fit=crop",
};

const services = [
  { title: "The Spa", desc: "Eight treatment rooms including two couples suites. Our therapists draw from ancient and modern traditions to create bespoke treatments using natural, ethically sourced ingredients." },
  { title: "Fitness Center", desc: "A state-of-the-art fitness center with personal training available. Equipment by Technogym, open 24 hours for guests." },
  { title: "25m Indoor Pool", desc: "A serene 25-meter heated indoor pool surrounded by floor-to-ceiling windows. Complimentary for all hotel guests." },
];

const treatments = [
  { name: "Meridian Signature Massage", time: "90 min", price: 285 },
  { name: "Deep Tissue Recovery", time: "60 min", price: 225 },
  { name: "Facial Rejuvenation", time: "75 min", price: 265 },
  { name: "Couples Retreat", time: "120 min", price: 595 },
];

export default function WellnessPage() {
  return (<>
    <Header />
    <main className="flex-1">
      <section className="relative py-24 md:py-32 bg-cream"><div className="container text-center">
        <p className="overline mb-4 text-muted">Wellness</p>
        <h1 className="text-4xl md:text-5xl mb-4 text-charcoal">Spa & Wellness</h1>
        <p className="editorial-text max-w-xl mx-auto text-charcoal-light">A sanctuary of calm in the heart of the city. Restore, renew, and rediscover yourself.</p>
      </div></section>

      <section className="section"><div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((item) => (
            <div key={item.title} className="text-center">
              <div className="aspect-square rounded-lg mb-6 overflow-hidden">
                <img src={wellnessServiceImages[item.title] || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="text-xl mb-3">{item.title}</h3>
              <p className="text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="section-sm bg-cream text-center"><div className="container-narrow">
        <p className="overline mb-4">Treatments</p>
        <h2 className="mb-4">Spa Menu Highlights</h2>
        <div className="max-w-md mx-auto text-left space-y-6 mt-8">
          {treatments.map((t) => (
            <div key={t.name} className="flex justify-between items-center py-3 border-b border-border-light">
              <div><p className="font-medium text-charcoal">{t.name}</p><p className="text-sm text-muted">{t.time}</p></div>
              <span className="font-serif text-lg text-charcoal">{"$" + t.price}</span>
            </div>
          ))}
        </div>
        <a href="tel:+12125550100" className="btn btn-primary mt-10">Book a Treatment</a>
      </div></section>
    </main>
    <Footer />
  </>);
}