import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { rooms, getRoomBySlug, getRelatedRooms } from "@/lib/data/rooms";
import { Maximize, Users, BedDouble, Eye, MapPin, Check, ChevronRight, ArrowRight, ChevronLeft, Star } from "lucide-react";
import RoomImage from "@/components/rooms/RoomImage";

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();
  const related = getRelatedRooms(slug, 3);

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">

        {/* Hero Gallery */}
        <section className="relative h-[60vh] min-h-[400px] bg-cream">
          <div className="absolute inset-0 bg-gradient-to-br from-cream-dark via-cream to-[#E8DFD0] flex items-center justify-center">
            <span className="text-muted text-lg">{room.name}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-8">
            <div className="container">
              <p className="overline text-muted mb-2">{room.category}</p>
              <h1 className="text-3xl md:text-5xl text-charcoal">{room.name}</h1>
            </div>
          </div>
          {room.images.length > 1 && (
            <div className="absolute bottom-8 right-8 bg-card/90 backdrop-blur-sm rounded px-3 py-1.5 text-sm text-charcoal">
              1 / {room.images.length}
            </div>
          )}
        </section>

        {/* Room Facts Bar */}
        <section className="border-b border-border-light">
          <div className="container">
            <div className="room-facts">
              <div className="text-center"><div className="room-fact-value">{room.size}</div><div className="room-fact-label">Size</div></div>
              <div className="text-center"><div className="room-fact-value">Up to {room.maxGuests}</div><div className="room-fact-label">Guests</div></div>
              <div className="text-center"><div className="room-fact-value">{room.bedType}</div><div className="room-fact-label">Bed</div></div>
              <div className="text-center"><div className="room-fact-value">{room.view}</div><div className="room-fact-label">View</div></div>
              <div className="text-center"><div className="room-fact-value">{room.floor}</div><div className="room-fact-label">Floor</div></div>
            </div>
          </div>
        </section>

        {/* Content + Booking Sidebar */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Description */}
                <p className="editorial-text text-charcoal-light leading-relaxed mb-10">{room.description}</p>

                {/* Highlights */}
                <div className="mb-10">
                  <h3 className="text-xl mb-6">Room Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {room.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-3 py-2">
                        <Star className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="text-charcoal-light">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-10">
                  <h3 className="text-xl mb-6">Amenities</h3>
                  {room.amenities.map((group) => (
                    <div key={group.group} className="mb-6">
                      <h4 className="text-sm font-medium uppercase tracking-wider text-muted mb-3">{group.group}</h4>
                      <div className="amenity-grid">
                        {group.items.map((item) => (
                          <div key={item} className="amenity-item">
                            <Check className="w-4 h-4 text-gold flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* What's Included */}
                <div className="mb-10 p-6 bg-cream rounded-lg">
                  <h3 className="text-xl mb-4">What's Included</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {room.includedFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-charcoal-light">
                        <Check className="w-4 h-4 text-gold" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-10">
                  <h3 className="text-xl mb-6">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[{ label: "Size", value: room.size + " (" + room.sizeSqFt + " sq ft)" }, { label: "Guests", value: "Up to " + room.maxGuests }, { label: "Bed", value: room.bedType }, { label: "View", value: room.view }, { label: "Floor", value: room.floor }, { label: "Category", value: room.category }].map((spec) => (
                      <div key={spec.label} className="p-4 border border-border-light rounded-lg">
                        <div className="text-xs uppercase tracking-wider text-muted mb-1">{spec.label}</div>
                        <div className="font-medium text-charcoal">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="booking-widget sticky top-28">
                  <div className="mb-6">
                    <p className="text-sm text-muted mb-1">Starting from</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif text-charcoal">{"$" + room.startingPrice.toLocaleString()}</span>
                      <span className="text-sm text-muted">/ night</span>
                    </div>
                  </div>

                  {/* Date Inputs */}
                  <div className="space-y-3 mb-4">
                    <div className="form-group">
                      <label className="form-label">Check In</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Check Out</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Guests</label>
                      <select className="form-select" defaultValue="2">
                        {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-full mb-3">Check Availability</button>
                  <button className="btn btn-secondary btn-full">Reserve Now</button>

                  {/* Rate Options */}
                  <div className="mt-6 pt-6 border-t border-border-light">
                    <p className="text-sm font-medium uppercase tracking-wider text-muted mb-3">Rate Options</p>
                    <div className="space-y-3">
                      {room.rates.map((rate) => (
                        <div key={rate.id} className="rate-card">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-charcoal text-sm">{rate.name}</span>
                            <span className="font-serif text-charcoal">{"$" + rate.price.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted">{rate.cancellation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="mt-6 pt-6 border-t border-border-light">
                    <p className="text-sm font-medium uppercase tracking-wider text-muted mb-3">Optional Extras</p>
                    <div className="space-y-2">
                      {room.extras.map((extra) => (
                        <div key={extra.name} className="flex justify-between items-center py-2 text-sm">
                          <div>
                            <span className="text-charcoal">{extra.name}</span>
                            <span className="text-muted ml-1">+{"$" + extra.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Rooms */}
        {related.length > 0 && (
          <section className="section bg-cream">
            <div className="container">
              <div className="text-center mb-10">
                <p className="overline mb-3 text-muted">You may also like</p>
                <h2 className="text-2xl">Explore More</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link key={r.slug} href={"/rooms/" + r.slug} className="room-card">
                    <div className="room-card-image">
                      <RoomImage roomName={r.name} category={r.category} />
                      <span className="room-card-category">{r.category}</span>
                    </div>
                    <div className="room-card-body">
                      <h3 className="room-card-name">{r.name}</h3>
                      <p className="room-card-desc">{r.shortDescription}</p>
                      <div className="room-card-price mt-2">
                        <span className="amount">{"$" + r.startingPrice.toLocaleString()}</span>
                        <span className="period ml-1">/ night</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border-light p-4 flex gap-3 md:hidden z-50">
        <Link href={"/rooms"} className="btn btn-secondary flex-1 text-center text-sm">Back to Rooms</Link>
        <button className="btn btn-primary flex-1 text-sm">Reserve</button>
      </div>

      <Footer />
    </>
  );
}
