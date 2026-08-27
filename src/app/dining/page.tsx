import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Clock, MapPin, Phone } from "lucide-react";

const restaurants = [
  {
    name: "The Garden",
    type: "Restaurant",
    description: "Seasonal, locally sourced cuisine in an intimate garden setting. Chef Maria Santos crafts menus that celebrate the rhythms of the year, using ingredients from the finest local farms and purveyors.",
    cuisine: "Modern American",
    hours: "Breakfast 7am-11am, Lunch 12pm-2pm, Dinner 6pm-10pm",
    location: "Ground Floor",
    dress: "Smart Casual",
  },
  {
    name: "Kintsugi",
    type: "Restaurant",
    description: "An omakase experience celebrating the art of Japanese cuisine. An intimate 12-seat counter where Chef Tanaka presents a multi-course journey through seasonal ingredients and traditional techniques.",
    cuisine: "Japanese Omakase",
    hours: "Dinner only, 6pm-10pm, Seatings at 6pm and 8:30pm",
    location: "2nd Floor",
    dress: "Smart Casual",
  },
  {
    name: "The Terrace Bar",
    type: "Bar",
    description: "Craft cocktails and panoramic views from our rooftop bar. A curated selection of rare spirits, house-made infusions, and classic cocktails with a contemporary twist.",
    cuisine: "Cocktails & Small Plates",
    hours: "5pm-12am, Friday & Saturday until 1am",
    location: "Rooftop",
    dress: "Smart Casual",
  },
];

export default function DiningPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative py-24 md:py-32 bg-cream">
          <div className="container text-center">
            <p className="overline mb-4 text-muted">Culinary</p>
            <h1 className="text-4xl md:text-5xl mb-4 text-charcoal">Dining</h1>
            <p className="editorial-text max-w-xl mx-auto text-charcoal-light">
              From garden-to-table breakfasts to omakase dinners, every meal at The Meridian is an occasion.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="space-y-16">
              {restaurants.map((r, i) => (
                <div key={r.name} className={"grid grid-cols-1 md:grid-cols-2 gap-12 items-center " + (i % 2 === 1 ? "md:[direction:rtl]" : "")}>
                  <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-cream-dark to-cream rounded-lg flex items-center justify-center">
                      <span className="text-muted">{r.name}</span>
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                    <p className="overline mb-2 text-gold">{r.type}</p>
                    <h2 className="text-3xl mb-4">{r.name}</h2>
                    <p className="editorial-text mb-6">{r.description}</p>
                    <div className="space-y-2 text-sm text-muted">
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {r.hours}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {r.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-sm bg-cream text-center">
          <div className="container-narrow">
            <p className="overline mb-4">Reservations</p>
            <h2 className="mb-4">Make a Reservation</h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              For dining reservations, please call us or speak with your concierge. We recommend booking at least 48 hours in advance for dinner.
            </p>
            <a href="tel:+12125550100" className="btn btn-primary">Call to Reserve</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
