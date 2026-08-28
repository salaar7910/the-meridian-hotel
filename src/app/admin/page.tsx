"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Plus, Edit, Eye, BarChart3, Calendar, Users, BedDouble, Trash2 } from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  category: string;
  size_sqm: number;
  max_guests: number;
  is_active: boolean;
  rates?: { base_price: number }[];
}

export default function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState({ totalRooms: 0, totalBookings: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/rooms").then(r => r.json()),
      fetch("/api/admin/stats").then(r => r.json()),
    ]).then(([roomData, statsData]) => {
      setRooms(roomData.rooms || []);
      setStats(statsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    setRooms(rooms.filter(r => r.id !== id));
  };

  const avgPrice = rooms.length > 0
    ? Math.round(rooms.reduce((s, r) => s + (r.rates?.[0]?.base_price || 0), 0) / rooms.length)
    : 0;

  return (<>
    <Header />
    <main className="flex-1">
      <section className="py-12 bg-cream"><div className="container">
        <div className="flex items-center justify-between">
          <div><p className="overline mb-2 text-muted">Dashboard</p><h1 className="text-3xl text-charcoal">Admin</h1></div>
          <Link href="/admin/rooms/new" className="btn btn-primary"><Plus className="w-4 h-4 mr-1" /> Add Room</Link>
        </div>
      </div></section>

      <section className="section-sm"><div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Rooms", value: stats.totalRooms, icon: BedDouble },
            { label: "Avg. Rate", value: "$" + avgPrice, icon: BarChart3 },
            { label: "Bookings", value: stats.totalBookings, icon: Calendar },
            { label: "Guests", value: stats.totalGuests, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-gold" />
              </div>
              <p className="text-2xl font-serif text-charcoal">{loading ? "--" : stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">Room Management</h2>
          <span className="text-sm text-muted">{rooms.length} rooms</span>
        </div>

        <div className="bg-card border border-border-light rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border-light"><tr>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Room</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Category</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Size</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Rate</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Status</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted p-4">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted">Loading...</td></tr>
              ) : rooms.map((room) => (
                <tr key={room.id} className="border-b border-border-light last:border-0">
                  <td className="p-4">
                    <p className="font-medium text-charcoal">{room.name}</p>
                    <p className="text-xs text-muted">/rooms/{room.slug}</p>
                  </td>
                  <td className="p-4"><span className="badge badge-success">{room.category}</span></td>
                  <td className="p-4 text-sm text-muted">{room.size_sqm} sq m</td>
                  <td className="p-4 text-sm font-medium text-charcoal">
                    {"$" + (room.rates?.[0]?.base_price || 0).toLocaleString()}/night
                  </td>
                  <td className="p-4">
                    <span className={room.is_active ? "text-green-600 text-sm" : "text-red-500 text-sm"}>
                      {room.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={"/rooms/" + room.slug} className="text-muted hover:text-charcoal">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={"/admin/rooms/" + room.id} className="text-muted hover:text-charcoal">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(room.id, room.name)} className="text-muted hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div></section>
    </main>
    <Footer />
  </>);
}
