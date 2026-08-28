"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check, AlertCircle, Loader2, CreditCard, Info } from "lucide-react";

interface Rate { id: string; name: string; description: string; base_price: number; cancellation_policy: string; rate_includes: string[]; is_active?: boolean; }
interface Extra { name: string; description: string; price: number; }
interface BookingWidgetProps { roomId: string; roomName: string; startingPrice: number; maxGuests: number; rates: Rate[]; extras: Extra[]; }
type BookingStep = "dates" | "rate" | "guest" | "confirm";

export default function BookingWidget({ roomId, roomName, startingPrice, maxGuests, rates, extras }: BookingWidgetProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState<BookingStep>("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedRateId, setSelectedRateId] = useState(rates[0]?.id || "");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nights = useMemo(() => { if (!checkIn || !checkOut) return 0; return Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)); }, [checkIn, checkOut]);
  const selectedRate = rates.find((r) => r.id === selectedRateId);
  const ratePrice = selectedRate?.base_price || startingPrice;
  const roomTotal = ratePrice * nights;
  const extrasTotal = useMemo(() => extras.filter((e) => selectedExtras.includes(e.name)).reduce((s, e) => s + e.price, 0), [selectedExtras, extras]);
  const totalPrice = roomTotal + extrasTotal;
  const toggleExtra = (name: string) => setSelectedExtras((p) => p.includes(name) ? p.filter((n) => n !== name) : [...p, name]);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) { setError("Please select check-in and check-out dates."); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { setError("Check-out must be after check-in."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/availability?room_id=" + roomId + "&check_in=" + checkIn + "&check_out=" + checkOut);
      const data = await res.json();
      if (data.available) setStep("rate");
      else setError("This room is not available for the selected dates. Please try different dates.");
    } catch { setError("Could not check availability. Please try again."); } finally { setLoading(false); }
  };

  const goToGuestInfo = () => { if (!selectedRateId) { setError("Please select a rate plan."); return; } setError(""); setStep("guest"); };
  const goToConfirm = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) { setError("Please fill in your name and email."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError(""); setStep("confirm");
  };

  const submitBooking = async () => {
    setLoading(true); setError("");
    try {
      const bookingExtras = extras.filter((e) => selectedExtras.includes(e.name)).map((e) => ({ name: e.name, price: e.price, quantity: 1 }));
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guest_email: email, first_name: firstName, last_name: lastName, phone, room_id: roomId, rate_id: selectedRateId, check_in: checkIn, check_out: checkOut, guests_count: guestsCount, special_requests: specialRequests, extras: bookingExtras }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push("/booking/confirmation?code=" + data.confirmation_code + "&booking_id=" + data.booking_id + "&room=" + encodeURIComponent(roomName) + "&checkin=" + checkIn + "&checkout=" + checkOut + "&guests=" + guestsCount + "&total=" + data.total_price);
    } catch (err: any) { setError(err.message || "Something went wrong."); } finally { setLoading(false); }
  };

  const stepOrder: BookingStep[] = ["dates", "rate", "guest", "confirm"];
  const ci = stepOrder.indexOf(step);

  return (
    <div className="booking-widget sticky top-28">
      <div className="mb-6"><p className="text-sm text-muted mb-1">Starting from</p><div className="flex items-baseline gap-2"><span className="text-3xl font-serif text-charcoal">{"$" + startingPrice.toLocaleString()}</span><span className="text-sm text-muted">/ night</span></div></div>
      <div className="flex items-center gap-2 mb-6">
        {stepOrder.map((s, i) => (<div key={s} className="flex items-center gap-2"><div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium " + (step === s ? "bg-charcoal text-cream" : i < ci ? "bg-gold text-charcoal" : "bg-cream-dark text-muted")}>{i < ci ? <Check className="w-3.5 h-3.5" /> : i + 1}</div>{i < 3 && <div className="w-6 h-px bg-border-light" />}</div>))}
      </div>
      {error && <div className="mb-4 p-3 rounded-lg text-sm flex items-start gap-2" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

      {step === "dates" && (<div className="space-y-3">
        <div className="form-group"><label className="form-label">Check In</label><input type="date" className="form-input" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Check Out</label><input type="date" className="form-input" value={checkOut} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Guests</label><select className="form-select" value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))}>{Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (<option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>))}</select></div>
        <button className="btn btn-primary btn-full" onClick={checkAvailability} disabled={loading || !checkIn || !checkOut}>{loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Checking...</span> : <span className="flex items-center justify-center gap-2">Check Availability <ChevronRight className="w-4 h-4" /></span>}</button>
        {nights > 0 && <p className="text-xs text-center text-muted">{nights} night{nights > 1 ? "s" : ""} &middot; {"$" + ratePrice.toLocaleString()} / night</p>}
      </div>)}

      {step === "rate" && (<div className="space-y-3">
        <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-charcoal">{nights} night{nights > 1 ? "s" : ""} &middot; {checkIn} to {checkOut}</p><button onClick={() => setStep("dates")} className="text-xs text-gold hover:underline">Edit dates</button></div>
        <p className="text-sm font-medium uppercase tracking-wider text-muted mb-2">Select Rate</p>
        {rates.filter(r => r.is_active !== false).map((rate) => (<label key={rate.id} className={"rate-card cursor-pointer block " + (selectedRateId === rate.id ? "ring-1 ring-charcoal" : "")}><input type="radio" name="rate" value={rate.id} checked={selectedRateId === rate.id} onChange={() => setSelectedRateId(rate.id)} className="sr-only" /><div className="flex justify-between items-start mb-1"><span className="font-medium text-charcoal text-sm">{rate.name}</span><span className="font-serif text-charcoal">{"$" + rate.base_price.toLocaleString()}</span></div><p className="text-xs text-muted">{rate.cancellation_policy}</p>{rate.rate_includes && rate.rate_includes.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{rate.rate_includes.map((inc: string) => <span key={inc} className="text-[10px] px-2 py-0.5 bg-cream rounded-full text-muted">{inc}</span>)}</div>}</label>))}
        <div className="mt-4 pt-4 border-t border-border-light"><p className="text-sm font-medium uppercase tracking-wider text-muted mb-3">Optional Extras</p><div className="space-y-2">{extras.map((extra) => (<label key={extra.name} className={"flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors " + (selectedExtras.includes(extra.name) ? "border-charcoal bg-cream/50" : "border-border-light hover:border-muted")}><input type="checkbox" checked={selectedExtras.includes(extra.name)} onChange={() => toggleExtra(extra.name)} className="sr-only" /><div className={"w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 " + (selectedExtras.includes(extra.name) ? "bg-charcoal border-charcoal" : "border-border-light")}>{selectedExtras.includes(extra.name) && <Check className="w-3 h-3 text-cream" />}</div><div className="flex-1 min-w-0"><span className="text-sm text-charcoal">{extra.name}</span><span className="text-xs text-muted ml-1">{"+$" + extra.price}</span></div></label>))}</div></div>
        {nights > 0 && <div className="mt-4 p-4 bg-cream rounded-lg"><div className="flex justify-between text-sm mb-1"><span className="text-muted">{"$" + ratePrice.toLocaleString() + " x " + nights + " nights"}</span><span className="text-charcoal">{"$" + roomTotal.toLocaleString()}</span></div>{extrasTotal > 0 && <div className="flex justify-between text-sm mb-1"><span className="text-muted">Extras</span><span className="text-charcoal">{"$" + extrasTotal.toLocaleString()}</span></div>}<div className="flex justify-between font-medium pt-2 mt-2 border-t border-border-light"><span className="text-charcoal">Total</span><span className="text-charcoal font-serif text-lg">{"$" + totalPrice.toLocaleString()}</span></div></div>}
        <div className="flex gap-2"><button className="btn btn-secondary flex-1" onClick={() => setStep("dates")}><ChevronLeft className="w-4 h-4 mr-1" /> Back</button><button className="btn btn-primary flex-1" onClick={goToGuestInfo}>Continue <ChevronRight className="w-4 h-4 ml-1" /></button></div>
      </div>)}

      {step === "guest" && (<div className="space-y-3">
        <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-charcoal">Guest Information</p><button onClick={() => setStep("rate")} className="text-xs text-gold hover:underline">Edit</button></div>
        <div className="grid grid-cols-2 gap-3"><div className="form-group"><label className="form-label">First Name *</label><input type="text" className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div><div className="form-group"><label className="form-label">Last Name *</label><input type="text" className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div></div>
        <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" /></div>
        <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" /></div>
        <div className="form-group"><label className="form-label">Special Requests</label><textarea className="form-input" rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any preferences or special occasions..." /></div>
        <div className="flex gap-2"><button className="btn btn-secondary flex-1" onClick={() => setStep("rate")}><ChevronLeft className="w-4 h-4 mr-1" /> Back</button><button className="btn btn-primary flex-1" onClick={goToConfirm}>Review <ChevronRight className="w-4 h-4 ml-1" /></button></div>
      </div>)}

      {step === "confirm" && (<div className="space-y-4">
        <div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-charcoal">Review & Confirm</p><button onClick={() => setStep("guest")} className="text-xs text-gold hover:underline">Edit</button></div>
        <div className="p-4 bg-cream rounded-lg space-y-3">
          {[{l:"Room",v:roomName},{l:"Rate",v:selectedRate?.name||""},{l:"Dates",v:checkIn+" to "+checkOut},{l:"Nights",v:String(nights)},{l:"Guests",v:String(guestsCount)},{l:"Guest",v:firstName+" "+lastName},{l:"Email",v:email}].map((r,i) => <div key={i} className="flex justify-between text-sm"><span className="text-muted">{r.l}</span><span className="text-charcoal">{r.v}</span></div>)}
          {selectedExtras.length > 0 && <div className="pt-2 border-t border-border-light"><p className="text-xs text-muted mb-1">Extras</p>{selectedExtras.map((name) => { const ex = extras.find((e) => e.name === name); return <div key={name} className="flex justify-between text-sm"><span className="text-charcoal">{name}</span><span className="text-charcoal">{"$" + (ex?.price || 0)}</span></div>; })}</div>}
        </div>
        <div className="p-4 bg-cream rounded-lg">
          <div className="flex justify-between text-sm mb-1"><span className="text-muted">{"$" + ratePrice.toLocaleString() + " x " + nights + " nights"}</span><span className="text-charcoal">{"$" + roomTotal.toLocaleString()}</span></div>
          {extrasTotal > 0 && <div className="flex justify-between text-sm mb-1"><span className="text-muted">Extras</span><span className="text-charcoal">{"$" + extrasTotal.toLocaleString()}</span></div>}
          <div className="flex justify-between font-medium pt-2 mt-2 border-t border-border-light"><span className="text-charcoal">Total</span><span className="text-charcoal font-serif text-xl">{"$" + totalPrice.toLocaleString()}</span></div>
        </div>
        <p className="text-xs text-muted text-center flex items-center justify-center gap-1"><Info className="w-3 h-3" /> No payment required now. Pay at the hotel.</p>
        <div className="flex gap-2"><button className="btn btn-secondary flex-1" onClick={() => setStep("guest")}><ChevronLeft className="w-4 h-4 mr-1" /> Back</button><button className="btn btn-primary flex-1" onClick={submitBooking} disabled={loading}>{loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Booking...</span> : <span className="flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" /> Confirm Reservation</span>}</button></div>
      </div>)}
    </div>
  );
}
