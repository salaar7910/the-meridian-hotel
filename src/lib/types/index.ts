// ============================================================
// Database types for The Meridian hotel platform
// ============================================================

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  timezone: string;
  created_at: string;
}

export interface RoomType {
  id: string;
  hotel_id: string;
  name: string;
  slug: string;
  category: "room" | "suite" | "signature_suite";
  short_description: string | null;
  description: string | null;
  size_sqm: number | null;
  size_sqft: number | null;
  max_guests: number;
  bed_type: string;
  view_type: string | null;
  floor_info: string | null;
  accessibility_info: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  room_images?: RoomImage[];
  highlights?: RoomHighlight[];
  amenities?: RoomAmenity[];
  rate_plans?: RatePlan[];
  included_features?: IncludedFeature[];
  primary_image?: RoomImage | null;
  starting_price?: number;
}

export interface RoomImage {
  id: string;
  room_type_id: string;
  storage_path: string;
  caption: string | null;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface RoomHighlight {
  id: string;
  room_type_id: string;
  text: string;
  icon: string | null;
  sort_order: number;
}

export interface RoomAmenity {
  id: string;
  room_type_id: string;
  category: string;
  name: string;
  icon: string | null;
  sort_order: number;
}

export interface RatePlan {
  id: string;
  room_type_id: string;
  name: string;
  description: string | null;
  cancellation_policy: string | null;
  price_per_night: number;
  is_active: boolean;
  sort_order: number;
}

export interface IncludedFeature {
  id: string;
  room_type_id: string;
  feature_name: string;
  sort_order: number;
}

export interface OptionalExtra {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  price: number;
  quantity_min: number;
  quantity_max: number;
  is_refundable: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface RoomInventory {
  id: string;
  room_type_id: string;
  date: string;
  total_rooms: number;
  available_rooms: number;
  is_blocked: boolean;
}

export interface Booking {
  id: string;
  confirmation_number: string;
  customer_id: string | null;
  hotel_id: string;
  room_type_id: string;
  rate_plan_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  rooms_count: number;
  subtotal: number;
  taxes: number;
  fees: number;
  extras_total: number;
  discount_amount: number;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  room_type?: RoomType;
  rate_plan?: RatePlan;
  booking_extras?: BookingExtra[];
  guest_details?: GuestDetail[];
}

export interface BookingExtra {
  id: string;
  booking_id: string;
  extra_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  extra?: OptionalExtra;
}

export interface GuestDetail {
  id: string;
  booking_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_primary: boolean;
}

export interface Payment {
  id: string;
  booking_id: string;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded";
  payment_method: string | null;
  refund_amount: number;
  created_at: string;
}

export interface Customer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// API / UI types
// ============================================================

export interface AvailabilityRequest {
  room_type_id: string;
  check_in: string;
  check_out: string;
  adults: number;
  rooms_count: number;
}

export interface AvailabilityResponse {
  available: boolean;
  available_rooms: number;
  rate_plans: RatePlan[];
  total_nights: number;
  message?: string;
}

export interface BookingSummary {
  room_type: RoomType;
  rate_plan: RatePlan;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  rooms_count: number;
  subtotal: number;
  taxes: number;
  fees: number;
  extras: BookingExtra[];
  extras_total: number;
  discount_amount: number;
  total_amount: number;
}

export type RoomCategory = "all" | "room" | "suite" | "signature_suite";

export interface AdminStats {
  total_bookings: number;
  active_bookings: number;
  total_revenue: number;
  total_guests: number;
  total_rooms: number;
  occupancy_rate: number;
}
