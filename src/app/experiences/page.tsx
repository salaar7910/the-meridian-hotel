import { Header } from "@/components/layout/Header";
const experienceImages: Record<string, string> = {
  "Private Gallery Tour": "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&q=80&auto=format&fit=crop",
  "Sunrise Yoga": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop",
  "Mixology Masterclass": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80&auto=format&fit=crop",
  "Central Park Picnic": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop",
  "Chef's Table Experience": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80&auto=format&fit=crop",
  "Spa & Wellness Day": "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80&auto=format&fit=crop",
};
import { Footer } from "@/components/layout/Footer";

const experiences = [
  { name: "Private Gallery Tour", description: "Exclusive after-hours tour of the city finest galleries, curated by our in-house art advisor.", category: "Culture" },
  { name: "Central Park Sunrise Yoga", description: "Start your morning with a private yoga session in the park, led by our wellness team.", category: "Wellness" },
  { name: "Rooftop Cinema", description: "Classic films under the stars on our private rooftop, with champagne and light bites.", category: "Entertainment" },
  { name: "Chefs Table", description: "An intimate evening at the chefs table with a bespoke tasting menu and wine pairings.", category: "Dining" },
  { name: "Bespoke Shopping", description: "Private after-hours access to Fifth Avenue boutiques with a personal stylist.", category: "Lifestyle" },
  { name: "Helicopter City Tour", description: "See Manhattan from above with a private helicopter tour at golden hour.", category: "Adventure" },
];

export default function ExperiencesPage() {
  return (<>
    <Header />
    <main className="flex-1">
      <section className="relative py-24 md:py-32 bg-cream"><div className="container text-center">
        <p className="overline mb-4 text-muted">Curated</p>
        <h1 className="text-4xl md:text-5xl mb-4 text-charcoal">Experiences</h1>
        <p className="editorial-text max-w-xl mx-auto text-charcoal-light">Beyond the extraordinary, our curated experiences reveal the soul of the city.</p>
      </div></section>
      <section className="section"><div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <div key={exp.name} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-lg mb-4 overflow-hidden"><img src={experienceImages[exp.name] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop"} alt={exp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /></div>
              <p className="overline text-gold text-xs mb-2">{exp.category}</p>
              <h3 className="text-xl mb-2">{exp.name}</h3>
              <p className="text-muted text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div></section>
      <section className="section-sm bg-cream text-center"><div className="container-narrow">
        <p className="overline mb-4">Bespoke</p>
        <h2 className="mb-4">Create Your Own Experience</h2>
        <p className="text-muted mb-8 max-w-lg mx-auto">Our concierge team can craft a bespoke experience tailored to your interests.</p>
        <a href="tel:+12125550100" className="btn btn-primary">Speak with Concierge</a>
      </div></section>
    </main>
    <Footer />
  </>);
}
