export interface RoomImage {
  src: string;
  alt: string;
  caption?: string;
}
export interface RoomRate {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  cancellation: string;
  includes: string[];
}
export interface RoomAmenity {
  group: string;
  items: string[];
}
export interface RoomExtra {
  name: string;
  description: string;
  price: number;
}
export interface Room {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  images: RoomImage[];
  size: string;
  sizeSqFt: string;
  maxGuests: number;
  bedType: string;
  view: string;
  floor: string;
  highlights: string[];
  amenities: RoomAmenity[];
  includedFeatures: string[];
  rates: RoomRate[];
  extras: RoomExtra[];
  maxPrice: number;
  startingPrice: number;
}

const defaultAmenities = [
  { group: "Bedroom", items: ["King bed", "Premium linens", "Blackout curtains", "Pillow selection", "Bedside USB-C charging"] },
  { group: "Bathroom", items: ["Rain shower", "Soaking tub", "Luxury toiletries", "Bathrobes", "Hair dryer"] },
  { group: "Technology", items: ["High-speed Wi-Fi", "Smart TV", "Bluetooth audio", "USB-C charging"] },
  { group: "Comfort", items: ["Air conditioning", "Heating", "Minibar", "Safe", "Nespresso machine"] },
  { group: "Services", items: ["Daily housekeeping", "Room service", "Concierge access"] },
];

const defaultExtras = [
  { name: "Breakfast", description: "Full breakfast at The Garden", price: 65 },
  { name: "Airport Transfer", description: "Private car service", price: 195 },
  { name: "Late Checkout", description: "Extended until 2pm", price: 75 },
  { name: "Romantic Setup", description: "Champagne, flowers, and chocolates", price: 150 },
];

export const rooms: Room[] = [
  {
    name: "Garden Room",
    slug: "garden-room",
    category: "Room",
    shortDescription: "A serene retreat opening onto the hotel’s manicured gardens.",
    description: "The Garden Room is a serene retreat that opens directly onto the hotel’s manicured gardens. Warm timber finishes, natural light flooding through floor-to-ceiling windows, and a carefully considered layout create a space that feels both intimate and generous. The marble bathroom features a deep soaking tub positioned to frame garden views, while the sleeping area is anchored by a king bed dressed in the finest Egyptian cotton linens.",
    images: [
      { src: "/images/rooms/garden-room.jpg", alt: "Garden Room bedroom", caption: "Garden Room — Living Area" },
      { src: "/images/rooms/garden-room-bath.jpg", alt: "Garden Room bathroom", caption: "Garden Room — Bathroom" },
      { src: "/images/rooms/garden-room-view.jpg", alt: "Garden Room garden view", caption: "Garden Room — Garden View" },
    ],
    size: "42 m²",
    sizeSqFt: "452",
    maxGuests: 2,
    bedType: "King",
    view: "Garden",
    floor: "Ground – 2nd",
    highlights: ["Private garden access", "Deep soaking tub", "Floor-to-ceiling windows", "Nespresso machine"],
    amenities: defaultAmenities,
    includedFeatures: ["Wi-Fi", "Daily housekeeping", "Concierge access", "Welcome amenity"],
    rates: [
      { id: "flexible", name: "Flexible Rate", description: "Free cancellation up to 48 hours before arrival", price: 650, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping"] },
      { id: "non-refundable", name: "Non-Refundable", description: "Best available rate with no refunds", price: 585, currency: "USD", cancellation: "No refund on cancellation or modification", includes: ["Wi-Fi", "Daily housekeeping"] },
      { id: "breakfast", name: "Breakfast Included", description: "Room with daily breakfast for two", price: 750, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping", "Breakfast for two"] },
    ],
    extras: defaultExtras,
    startingPrice: 585,
    maxPrice: 750,
  },
  {
    name: "Deluxe King",
    slug: "deluxe-king",
    category: "Room",
    shortDescription: "Thoughtfully appointed with marble bathroom and courtyard views.",
    description: "The Deluxe King is thoughtfully appointed with natural materials throughout. A marble bathroom with walk-in rain shower and separate soaking tub, curated artwork, and views over the tranquil courtyard garden create a space of understated elegance. The room features a dedicated work area, plush king bed, and considered lighting that shifts naturally with the time of day.",
    images: [
      { src: "/images/rooms/deluxe-king.jpg", alt: "Deluxe King bedroom", caption: "Deluxe King — Bedroom" },
      { src: "/images/rooms/deluxe-king-bath.jpg", alt: "Deluxe King bathroom", caption: "Deluxe King — Marble Bathroom" },
    ],
    size: "38 m²",
    sizeSqFt: "409",
    maxGuests: 2,
    bedType: "King",
    view: "Courtyard Garden",
    floor: "2nd – 5th",
    highlights: ["Marble bathroom", "Walk-in rain shower", "Courtyard garden view", "Dedicated workspace"],
    amenities: defaultAmenities,
    includedFeatures: ["Wi-Fi", "Daily housekeeping", "Concierge access"],
    rates: [
      { id: "flexible", name: "Flexible Rate", description: "Free cancellation up to 48 hours before arrival", price: 520, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping"] },
      { id: "non-refundable", name: "Non-Refundable", description: "Best available rate with no refunds", price: 470, currency: "USD", cancellation: "No refund on cancellation or modification", includes: ["Wi-Fi", "Daily housekeeping"] },
      { id: "breakfast", name: "Breakfast Included", description: "Room with daily breakfast for two", price: 620, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping", "Breakfast for two"] },
    ],
    extras: defaultExtras,
    startingPrice: 470,
    maxPrice: 620,
  },

  {
    name: "Terrace Room",
    slug: "terrace-room",
    category: "Room",
    shortDescription: "Step onto your private terrace with garden views.",
    description: "The Terrace Room extends beyond its generous interior to a private outdoor terrace. Morning light pours through sliding glass doors. Inside, warm neutrals, natural oak flooring, a plush king bed, and a marble bathroom with dual vanity.",
    images: [{ src: "/images/rooms/terrace-room.jpg", alt: "Terrace Room", caption: "Terrace Room" }],
    size: "45 m²", sizeSqFt: "484", maxGuests: 2, bedType: "King", view: "Garden", floor: "1st - 3rd",
    highlights: ["Private terrace", "Outdoor seating", "Dual vanity marble bathroom", "Oak flooring"],
    amenities: defaultAmenities,
    includedFeatures: ["Wi-Fi", "Daily housekeeping", "Concierge access", "Welcome amenity"],
    rates: [
      { id: "flexible", name: "Flexible Rate", description: "Free cancellation up to 48 hours before arrival", price: 720, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping"] },
      { id: "non-refundable", name: "Non-Refundable", description: "Best available rate with no refunds", price: 650, currency: "USD", cancellation: "No refund", includes: ["Wi-Fi", "Daily housekeeping"] },
    ],
    extras: defaultExtras, startingPrice: 650, maxPrice: 720,
  },

  {
    name: "Park Suite",
    slug: "park-suite",
    category: "Suite",
    shortDescription: "Generous living space with floor-to-ceiling park views.",
    description: "The Park Suite is a generous expression of proportion and light. Floor-to-ceiling windows frame uninterrupted views across the park. The suite features curated contemporary art, bespoke furnishings, and a deep soaking tub positioned to capture the view.",
    images: [{ src: "/images/rooms/park-suite.jpg", alt: "Park Suite", caption: "Park Suite - Living Area" }],
    size: "78 m²", sizeSqFt: "840", maxGuests: 3, bedType: "King", view: "Park", floor: "6th - 12th",
    highlights: ["Park views", "Separate living room", "Deep soaking tub", "Walk-in closet", "Curated artwork"],
    amenities: defaultAmenities.concat([{ group: "Suite Extras", items: ["Separate living area", "Walk-in closet", "Dining area for two", "Butler pantry"] }]),
    includedFeatures: ["Wi-Fi", "Daily housekeeping", "Concierge access", "Welcome amenity", "Evening turndown"],
    rates: [
      { id: "flexible", name: "Flexible Rate", description: "Free cancellation up to 48 hours before arrival", price: 1200, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping", "Evening turndown"] },
      { id: "non-refundable", name: "Non-Refundable", description: "Best available rate", price: 1080, currency: "USD", cancellation: "No refund", includes: ["Wi-Fi", "Daily housekeeping"] },
    ],
    extras: defaultExtras.concat([{ name: "Private Dining", description: "In-suite chef dinner for two", price: 450 }]),
    startingPrice: 1080, maxPrice: 1200,
  },

  {
    name: "Skyline Suite",
    slug: "skyline-suite",
    category: "Suite",
    shortDescription: "Panoramic skyline views with a private terrace.",
    description: "Perched on the upper floors, the Skyline Suite commands panoramic views across the city skyline. The suite opens to a private terrace. Bespoke furnishings, a marble bathroom with freestanding tub, and a separate living space create an elevated retreat.",
    images: [{ src: "/images/rooms/skyline-suite.jpg", alt: "Skyline Suite", caption: "Skyline Suite" }],
    size: "95 m²", sizeSqFt: "1023", maxGuests: 2, bedType: "King", view: "City Skyline", floor: "15th - 20th",
    highlights: ["Private terrace", "Panoramic skyline views", "Freestanding bathtub", "Bespoke furnishings", "Separate living area"],
    amenities: defaultAmenities.concat([{ group: "Suite Extras", items: ["Private terrace", "Separate living area", "Freestanding bathtub", "Dining area"] }]),
    includedFeatures: ["Wi-Fi", "Daily housekeeping", "Concierge access", "Evening turndown", "Complimentary pressing"],
    rates: [
      { id: "flexible", name: "Flexible Rate", description: "Free cancellation up to 48 hours before arrival", price: 1800, currency: "USD", cancellation: "Free cancellation until 48 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping", "Evening turndown"] },
      { id: "non-refundable", name: "Non-Refundable", description: "Best available rate", price: 1620, currency: "USD", cancellation: "No refund", includes: ["Wi-Fi", "Daily housekeeping"] },
    ],
    extras: defaultExtras.concat([{ name: "Champagne Package", description: "Dom Perignon with strawberries", price: 275 }]),
    startingPrice: 1620, maxPrice: 1800,
  },

  {
    name: "Meridian Suite",
    slug: "meridian-suite",
    category: "Signature Suite",
    shortDescription: "The pinnacle: two-bedroom residence with butler service.",
    description: "The Meridian Suite is the hotel’s finest accommodation. This two-bedroom residence spans the top floor with wraparound terrace views. A private dining room seats six, the living room features a fireplace, and a dedicated butler ensures every desire is met. The master bedroom includes a walk-in closet and spa-like bathroom with dual rain showers.",
    images: [{ src: "/images/rooms/meridian-suite.jpg", alt: "Meridian Suite", caption: "Meridian Suite - Living Area" }],
    size: "165 m²", sizeSqFt: "1776", maxGuests: 4, bedType: "King + Twin", view: "360 Panoramic", floor: "Top Floor",
    highlights: ["Wraparound terrace", "Butler service", "Private dining room", "Fireplace", "360-degree views", "Dual rain showers"],
    amenities: defaultAmenities.concat([{ group: "Suite Extras", items: ["Wraparound terrace", "Private dining room", "Butler service", "Fireplace", "Dual rain showers", "Wine fridge", "Grand piano"] }]),
    includedFeatures: ["Wi-Fi", "Daily housekeeping", "Concierge access", "Evening turndown", "Butler service", "Complimentary pressing", "Airport transfer", "Welcome champagne"],
    rates: [
      { id: "flexible", name: "Flexible Rate", description: "Free cancellation up to 72 hours before arrival", price: 3500, currency: "USD", cancellation: "Free cancellation until 72 hours before check-in", includes: ["Wi-Fi", "Daily housekeeping", "Butler service"] },
      { id: "non-refundable", name: "Non-Refundable", description: "Best available rate", price: 3150, currency: "USD", cancellation: "No refund", includes: ["Wi-Fi", "Daily housekeeping", "Butler service"] },
    ],
    extras: defaultExtras.concat([{ name: "Private Dining", description: "In-suite chef dinner for up to 6", price: 850 }, { name: "Wine Collection", description: "Curated selection from our cellar", price: 500 }]),
    startingPrice: 3150, maxPrice: 3500,
  },
];

export const categories = ["All", "Room", "Suite", "Signature Suite"] as const;

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

export function getRoomsByCategory(category: string): Room[] {
  if (category === "All") return rooms;
  return rooms.filter((r) => r.category === category);
}

export function getRelatedRooms(currentSlug: string, limit = 3): Room[] {
  return rooms.filter((r) => r.slug !== currentSlug).slice(0, limit);
}
