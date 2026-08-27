"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { rooms, categories, type Room } from "@/lib/data/rooms";
import { Maximize, Users, BedDouble, ArrowRight } from "lucide-react";
import RoomImage from "@/components/rooms/RoomImage";

export default function RoomsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const filteredRooms = activeCategory === "All" ? rooms : rooms.filter((r) => r.category === activeCategory);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 bg-cream">
          <div className="container text-center">
            <p className="overline mb-4 text-muted">Accommodations</p>
            <h1 className="text-4xl md:text-5xl mb-4 text-charcoal">Rooms &amp; Suites</h1>
            <p className="editorial-text max-w-xl mx-auto text-charcoal-light">
              Each room is a private sanctuary, thoughtfully designed with natural materials, generous proportions, and considered details.
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="border-b border-border-light bg-background sticky top-[72px] z-40">
          <div className="container">
            <div className="flex justify-center gap-8 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={"pb-4 pt-6 text-sm font-medium transition-colors border-b-2 whitespace-nowrap " + (activeCategory === cat ? "border-charcoal text-charcoal" : "border-transparent text-muted hover:text-charcoal")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Room Grid */}
        <section className="section">
          <div className="container">
            <p className="text-sm text-muted mb-8">{filteredRooms.length} accommodation{filteredRooms.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRooms.map((room) => (
                <Link key={room.slug} href={"/rooms/" + room.slug} className="room-card group">
                  <div className="room-card-image aspect-[16/10]">
                    <RoomImage roomName={room.name} category={room.category} className="transition-transform duration-500 group-hover:scale-105" />
                    <span className="room-card-category">{room.category}</span>
                  </div>
                  <div className="room-card-body p-6">
                    <h2 className="room-card-name text-xl mb-2">{room.name}</h2>
                    <p className="room-card-desc mb-4">{room.shortDescription}</p>
                    <div className="room-card-meta">
                      <span className="room-card-meta-item flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5" /> {room.size}
                      </span>
                      <span className="room-card-meta-item flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Up to {room.maxGuests}
                      </span>
                      <span className="room-card-meta-item flex items-center gap-1.5">
                        <BedDouble className="w-3.5 h-3.5" /> {room.bedType}
                      </span>
                      <span className="room-card-meta-item">{room.view}</span>
                    </div>
                    <div className="room-card-price flex items-end justify-between mt-4">
                      <div>
                        <span className="amount">{"$" + room.startingPrice.toLocaleString()}</span>
                        <span className="period ml-1">/ night</span>
                      </div>
                      <span className="text-sm text-gold font-medium flex items-center gap-1">
                        Discover More <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {filteredRooms.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted text-lg">No accommodations found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
