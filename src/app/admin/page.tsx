import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { rooms } from "@/lib/data/rooms";
import Link from "next/link";
import { Plus, Edit, Eye, BarChart3, Calendar, Users, BedDouble } from "lucide-react";

export default function AdminPage() {
  const totalRooms = rooms.length;
  const avgPrice = Math.round(rooms.reduce((s, r) => s + r.startingPrice, 0) / totalRooms);

  return (<>
    <Header />
    <main className="flex-1">
      <section className="py-12 bg-cream"><div className="container">
        <div className="flex items-center justify-between">
          <div><p className="overline mb-2 text-muted">Dashboard</p><h1 className="text-3xl text-charcoal">Admin</h1></div>
        </div>
      </div></section>

      <section className="section-sm"><div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[{ label: "Total Rooms", value: totalRooms, icon: BedDouble }, { label: "Avg. Rate", value: "$" + avgPrice, icon: BarChart3 }, { label: "Bookings", value: "--", icon: Calendar }, { label: "Guests", value: "--", icon: Users }].map((stat) => (
            <div key={stat.label} className="bg-card border border-border-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted">{stat.label}</span><stat.icon className="w-4 h-4 text-gold" /></div>
              <p className="text-2xl font-serif text-charcoal">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">Room Management</h2>
        </div>

        <div className="bg-card border border-border-light rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border-light"><tr>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Room</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Category</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Size</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Starting Rate</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Actions</th>
            </tr></thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.slug} className="border-b border-border-light last:border-0">
                  <td className="p-4"><p className="font-medium text-charcoal">{room.name}</p><p className="text-xs text-muted">/rooms/{room.slug}</p></td>
                  <td className="p-4"><span className="badge badge-success">{room.category}</span></td>
                  <td className="p-4 text-sm text-muted">{room.size}</td>
                  <td className="p-4 text-sm font-medium text-charcoal">{"$" + room.startingPrice.toLocaleString()}/night</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={"/rooms/" + room.slug} className="text-muted hover:text-charcoal"><Eye className="w-4 h-4" /></Link>
                      <button className="text-muted hover:text-charcoal"><Edit className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-cream rounded-lg text-center">
          <p className="text-muted mb-4">Connect to Supabase to enable full admin functionality including editing rooms, managing bookings, and uploading images.</p>
          <p className="text-xs text-muted">Set your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local</p>
        </div>
      </div></section>
    </main>
    <Footer />
  </>);
}
