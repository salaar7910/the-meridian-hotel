interface RoomImageProps {
  roomName: string;
  category: string;
  className?: string;
  aspect?: "landscape" | "square" | "tall";
}

type ImageEntry = { src: string; alt: string };

const allImages: Record<string, ImageEntry> = {
  "Garden Room": { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80&auto=format&fit=crop", alt: "Elegant hotel room with garden view" },
  "Deluxe King": { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop", alt: "Luxurious king bed hotel room" },
  "Terrace Room": { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&auto=format&fit=crop", alt: "Hotel room with private terrace" },
  "Park Suite": { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80&auto=format&fit=crop", alt: "Spacious suite with park views" },
  "Skyline Suite": { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop", alt: "Skyline suite with panoramic views" },
  "Meridian Suite": { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop", alt: "Signature suite" },
  "The Garden": { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop", alt: "Garden restaurant" },
  "Yuki": { src: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=80&auto=format&fit=crop", alt: "Japanese omakase" },
  "The Mezzanine": { src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80&auto=format&fit=crop", alt: "Rooftop bar" },
  "Private Gallery Tour": { src: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&q=80&auto=format&fit=crop", alt: "Private gallery tour" },
  "Sunrise Yoga": { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop", alt: "Sunrise yoga" },
  "Mixology Masterclass": { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80&auto=format&fit=crop", alt: "Mixology class" },
  "Central Park Picnic": { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop", alt: "Central Park picnic" },
  "Chef's Table Experience": { src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80&auto=format&fit=crop", alt: "Chef's table" },
  "Spa & Wellness Day": { src: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80&auto=format&fit=crop", alt: "Spa day" },
  spa: { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop", alt: "Spa" },
  fitness: { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop", alt: "Fitness" },
  pool: { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80&auto=format&fit=crop", alt: "Pool" },
};

const fallback = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop";

export default function RoomImage({ roomName, category, className = "", aspect = "landscape" }: RoomImageProps) {
  const entry = allImages[roomName];
  const src = entry?.src || fallback;
  const alt = entry?.alt || roomName;

  const heights: Record<string, string> = {
    landscape: "aspect-[4/3] md:aspect-[16/10]",
    square: "aspect-square",
    tall: "aspect-[3/4]",
  };

  return (
    <div className={`relative overflow-hidden bg-cream-dark ${heights[aspect]} ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.85)", color: "var(--color-charcoal)", backdropFilter: "blur(8px)" }}>1 / 8</div>
    </div>
  );
}