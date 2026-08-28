import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight,
  MapPin,
  Star,
  UtensilsCrossed,
  Waves,
  Maximize,
  Users,
  BedDouble,
} from 'lucide-react';
import RoomImage from '@/components/rooms/RoomImage';

const featuredRooms = [
  { name: 'Garden Room', slug: 'garden-room', category: 'Room',
    desc: 'A serene retreat opening onto the gardens, with natural light and warm timber finishes.',
    size: '42 m²', guests: 2, bed: 'King', price: 650 },
  { name: 'Park Suite', slug: 'park-suite', category: 'Suite',
    desc: 'Generous living space with floor-to-ceiling park views, a separate sitting area, and deep soaking tub.',
    size: '78 m²', guests: 3, bed: 'King', price: 1200 },
  { name: 'Skyline Suite', slug: 'skyline-suite', category: 'Suite',
    desc: 'Perched above the city with panoramic skyline views, a private terrace, and bespoke furnishings.',
    size: '95 m²', guests: 2, bed: 'King', price: 1800 },
  { name: 'Deluxe King', slug: 'deluxe-king', category: 'Room',
    desc: 'Thoughtfully appointed with natural materials, marble bathroom, and courtyard garden views.',
    size: '38 m²', guests: 2, bed: 'King', price: 520 },
  { name: 'Meridian Suite', slug: 'meridian-suite', category: 'Signature Suite',
    desc: 'The pinnacle: a two-bedroom residence with private dining, butler service, and wraparound terrace.',
    size: '165 m²', guests: 4, bed: 'King + Twin', price: 3500 },
  { name: 'Terrace Room', slug: 'terrace-room', category: 'Room',
    desc: 'Step onto your private terrace and enjoy morning coffee with garden views.',
    size: '45 m²', guests: 2, bed: 'King', price: 720 },
];
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-cream">
          <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80&auto=format&fit=crop" alt="Luxury hotel lobby" className="w-full h-full object-cover" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-background/40" />
          <div className="relative z-10 text-center container max-w-3xl px-6">
            <p className="overline mb-6 text-muted">Est. 2024 — New York</p>
            <h1 className="text-5xl md:text-7xl mb-6 text-charcoal leading-tight">The Meridian</h1>
            <p className="editorial-text text-lg md:text-xl max-w-xl mx-auto mb-10 text-charcoal-light">
              Quiet luxury in the heart of Manhattan. A sanctuary of refined
              elegance, where every detail is considered and every moment is yours.
            </p>
            {/* Search Bar */}
            <div className="bg-card/95 backdrop-blur-md rounded-lg shadow-lg p-6 mx-auto">
              <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="form-group">
                  <label className="form-label">Check In</label>
                  <input type="date" className="form-input" aria-label="Check-in date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Check Out</label>
                  <input type="date" className="form-input" aria-label="Check-out date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Guests</label>
                  <select className="form-select" aria-label="Number of guests" defaultValue="2">
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
                <Link href="/rooms" className="btn btn-primary h-[42px] mt-auto whitespace-nowrap px-6">Check Availability</Link>
              </form>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="section">
          <div className="container-narrow text-center">
            <p className="overline mb-4">Welcome</p>
            <h2 className="mb-6">A Place Like No Other</h2>
            <p className="editorial-text max-w-2xl mx-auto">
              Rising above Midtown’s most prestigious crossroads, The Meridian
              offers an intimate retreat of just 42 rooms and suites. Each space
              is a considered expression of proportion, light, and material —
              designed not to impress, but to welcome you home.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="section-sm bg-cream">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-base mb-2">Five-Star Service</h4>
                <p className="text-sm text-muted">Intuitive, personal service that anticipates your every need</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-base mb-2">Prime Location</h4>
                <p className="text-sm text-muted">Steps from Central Park and the city’s finest cultural institutions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-base mb-2">Exceptional Dining</h4>
                <p className="text-sm text-muted">Two restaurants and a rooftop bar with seasonal, locally sourced cuisine</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                  <Waves className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-base mb-2">Wellness &amp; Spa</h4>
                <p className="text-sm text-muted">A full-service spa, fitness center, and 25-meter indoor pool</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Preview */}
        <section className="section">
          <div className="container">
            <div className="text-center mb-12">
              <p className="overline mb-4">Accommodations</p>
              <h2 className="mb-4">Rooms &amp; Suites</h2>
              <p className="text-muted max-w-lg mx-auto">
                Each room is a private sanctuary, thoughtfully designed with
                natural materials, generous proportions, and considered details.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center gap-8 mb-10 border-b border-border-light">
              {["Overview", "Rooms", "Suites", "Signature Suites"].map((tab, i) => (
                <button key={tab} className={"pb-3 text-sm font-medium transition-colors border-b-2 " + (i === 0 ? "border-charcoal text-charcoal" : "border-transparent text-muted hover:text-charcoal")}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <Link key={room.slug} href={"/rooms/" + room.slug} className="room-card">
                  <div className="room-card-image">
                    <RoomImage roomName={room.name} category={room.category} />
                    <span className="room-card-category">{room.category}</span>
                  </div>
                  <div className="room-card-body">
                    <h3 className="room-card-name">{room.name}</h3>
                    <p className="room-card-desc">{room.desc}</p>
                    <div className="room-card-meta">
                      <span className="room-card-meta-item flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5" /> {room.size}
                      </span>
                      <span className="room-card-meta-item flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Up to {room.guests}
                      </span>
                      <span className="room-card-meta-item flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" /> {room.bed}
                      </span>
                    </div>
                    <div className="room-card-price flex items-end justify-between">
                      <div>
                        <span className="amount">{"$" + room.price.toLocaleString()}</span>
                        <span className="period ml-1">/ night</span>
                      </div>
                      <span className="text-sm text-gold font-medium flex items-center gap-1">
                        View Room <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/rooms" className="btn btn-secondary">View All Accommodations <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>

        {/* Editorial CTA */}
        <section className="section-sm bg-cream">
          <div className="container-narrow text-center">
            <p className="overline mb-4">Experience</p>
            <h2 className="mb-6">Beyond the Room</h2>
            <p className="editorial-text max-w-2xl mx-auto mb-8">
              From sunrise yoga to candlelit dinners on the terrace, every moment
              at The Meridian is designed to restore, inspire, and delight.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/experiences" className="btn btn-primary">Explore Experiences <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/dining" className="btn btn-secondary">View Dining</Link>
            </div>
          </div>
        </section>

        {/* Contact Preview */}
        <section className="section">
          <div className="container-narrow text-center">
            <p className="overline mb-4">Get in Touch</p>
            <h2 className="mb-6">We Look Forward to Welcoming You</h2>
            <p className="text-muted max-w-lg mx-auto mb-8">
              Whether you have a question about availability, need help planning
              a special occasion, or simply want to learn more, our team is here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="tel:+12125550100" className="btn btn-secondary">Call Us</a>
              <Link href="/contact" className="btn btn-primary">Send a Message</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
