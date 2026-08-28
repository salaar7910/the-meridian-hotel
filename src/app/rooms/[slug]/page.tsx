"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import BookingWidget from "@/components/booking/BookingWidget";
import { Check, Star, Loader2 } from "lucide-react";
import RoomImage from "@/components/rooms/RoomImage";

export default function RoomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [room, setRoom] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/rooms/" + slug)
      .then((r) => r.json())
      .then((d) => { if (d.error) throw new Error(d.error); setRoom(d.room); setRelated(d.relatedRooms || []); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (<><Header /><main className="flex-1 flex items-center justify-center min-h-screen"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold" /><p className="text-muted">Loading...</p></div></main><Footer /></>);
  if (error || !room) return (<><Header /><main className="flex-1 flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-2xl mb-4">Room Not Found</h1><Link href="/rooms" className="btn btn-primary">Browse Rooms</Link></div></main><Footer /></>);

  const extras = [{ name: "Breakfast", description: "Full breakfast", price: 65 }, { name: "Airport Transfer", description: "Private car", price: 195 }, { name: "Late Checkout", description: "Extended until 2pm", price: 75 }, { name: "Romantic Setup", description: "Champagne and flowers", price: 150 }];

  return (<><Header /><main className="flex-1 pb-20 md:pb-0">
    <section className="relative h-[60vh] min-h-[400px] bg-cream">
      <div className="absolute inset-0">
        {room.room_images && room.room_images.length > 0 ? <img src={room.room_images[0].image_url} alt={room.room_images[0].alt_text || room.name} className="w-full h-full object-cover" /> : <RoomImage roomName={room.name} category={room.category} className="w-full h-full" />}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-8"><div className="container"><p className="overline text-muted mb-2">{room.category}</p><h1 className="text-3xl md:text-5xl text-charcoal">{room.name}</h1></div></div>
    </section>

    <section className="border-b border-border-light"><div className="container"><div className="room-facts">
      {[{ v: room.size, l: "Size" }, { v: "Up to " + room.max_guests, l: "Guests" }, { v: room.bed_type, l: "Bed" }, { v: room.view, l: "View" }, { v: room.floor, l: "Floor" }].map((f) => (<div key={f.l} className="text-center"><div className="room-fact-value">{f.v}</div><div className="room-fact-label">{f.l}</div></div>))}
    </div></div></section>

    <section className="section"><div className="container"><div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <p className="editorial-text text-charcoal-light leading-relaxed mb-10">{room.description}</p>
        {room.room_highlights && room.room_highlights.length > 0 && <div className="mb-10"><h3 className="text-xl mb-6">Room Highlights</h3><div className="grid grid-cols-2 gap-3">{room.room_highlights.map((h: any) => <div key={h.id} className="flex items-center gap-3 py-2"><Star className="w-4 h-4 text-gold flex-shrink-0" /><span className="text-charcoal-light">{h.highlight_text}</span></div>)}</div></div>}
        {room.amenity_groups && room.amenity_groups.length > 0 && <div className="mb-10"><h3 className="text-xl mb-6">Amenities</h3>{room.amenity_groups.map((g: any) => <div key={g.id} className="mb-6"><h4 className="text-sm font-medium uppercase tracking-wider text-muted mb-3">{g.group_name}</h4><div className="amenity-grid">{g.amenity_items.map((i: any) => <div key={i.id} className="amenity-item"><Check className="w-4 h-4 text-gold flex-shrink-0" /><span>{i.item_name}</span></div>)}</div></div>)}</div>}
        <div className="mb-10"><h3 className="text-xl mb-6">Specifications</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[{ l: "Size", v: room.size }, { l: "Guests", v: "Up to " + room.max_guests }, { l: "Bed", v: room.bed_type }, { l: "View", v: room.view }, { l: "Floor", v: room.floor }, { l: "Category", v: room.category }].map((s) => <div key={s.l} className="p-4 border border-border-light rounded-lg"><div className="text-xs uppercase tracking-wider text-muted mb-1">{s.l}</div><div className="font-medium text-charcoal">{s.v}</div></div>)}</div></div>
      </div>
      <div className="lg:col-span-1"><BookingWidget roomId={room.id} roomName={room.name} startingPrice={room.starting_price} maxGuests={room.max_guests} rates={room.rates || []} extras={extras} /></div>
    </div></div></section>

    {related.length > 0 && <section className="section bg-cream"><div className="container">
      <div className="text-center mb-10"><p className="overline mb-3 text-muted">You may also like</p><h2 className="text-2xl">Explore More</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{related.map((r: any) => <Link key={r.id} href={'/rooms/' + r.slug} className="room-card"><div className="room-card-image"><RoomImage roomName={r.name} category={r.category} /><span className="room-card-category">{r.category}</span></div><div className="room-card-body"><h3 className="room-card-name">{r.name}</h3><p className="room-card-desc">{r.short_description}</p><div className="room-card-price mt-2"><span className="amount">{"$" + r.starting_price.toLocaleString()}</span><span className="period ml-1">/ night</span></div></div></Link>)}</div>
    </div></section>}

    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border-light p-4 flex gap-3 md:hidden z-50"><Link href="/rooms" className="btn btn-secondary flex-1 text-center text-sm">Back to Rooms</Link><button className="btn btn-primary flex-1 text-sm">Reserve</button></div>
  </main><Footer /></>);
}
