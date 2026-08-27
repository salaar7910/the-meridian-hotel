-- =============================================
-- THE MERIDIAN HOTEL - DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- ROOMS
-- =============================================
create table rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  category text not null check (category in ("Room", "Suite", "Signature Suite")),
  short_description text,
  description text,
  size_sqm integer,
  size_sqft integer,
  max_guests integer not null default 2,
  bed_type text not null,
  view_type text,
  floor_info text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- ROOM IMAGES
-- =============================================
create table room_images (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  src text not null,
  alt text not null,
  caption text,
  sort_order integer not null default 0,
  is_primary boolean not null default false
);

-- =============================================
-- ROOM HIGHLIGHTS
-- =============================================
create table room_highlights (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  text text not null,
  sort_order integer not null default 0
);

-- =============================================
-- AMENITY GROUPS
-- =============================================
create table amenity_groups (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  group_name text not null,
  sort_order integer not null default 0
);

create table amenity_items (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references amenity_groups(id) on delete cascade,
  item_text text not null,
  sort_order integer not null default 0
);

-- =============================================
-- RATES
-- =============================================
create table rates (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  name text not null,
  description text,
  base_price numeric(10,2) not null,
  currency text not null default "USD",
  cancellation_policy text,
  is_active boolean not null default true
);

-- =============================================
-- PRICING (date-based)
-- =============================================
create table rate_pricing (
  id uuid primary key default uuid_generate_v4(),
  rate_id uuid not null references rates(id) on delete cascade,
  date date not null,
  price numeric(10,2) not null,
  available boolean not null default true,
  unique(rate_id, date)
);

-- =============================================
-- GUESTS / CUSTOMERS
-- =============================================
create table guests (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  first_name text not null,
  last_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- =============================================
-- BOOKINGS
-- =============================================
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  guest_id uuid not null references guests(id),
  room_id uuid not null references rooms(id),
  rate_id uuid not null references rates(id),
  check_in date not null,
  check_out date not null,
  guests_count integer not null default 1,
  rooms_count integer not null default 1,
  total_price numeric(10,2) not null,
  currency text not null default "USD",
  status text not null default "pending" check (status in ("pending", "confirmed", "cancelled", "completed")),
  special_requests text,
  confirmation_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);

-- =============================================
-- BOOKING EXTRAS
-- =============================================
create table booking_extras (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  quantity integer not null default 1
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_rooms_slug on rooms(slug);
create index idx_rooms_category on rooms(category);
create index idx_rooms_active on rooms(is_active);
create index idx_room_images_room on room_images(room_id);
create index idx_rates_room on rates(room_id);
create index idx_rate_pricing_rate on rate_pricing(rate_id);
create index idx_rate_pricing_date on rate_pricing(date);
create index idx_bookings_guest on bookings(guest_id);
create index idx_bookings_room on bookings(room_id);
create index idx_bookings_dates on bookings(check_in, check_out);
create index idx_bookings_status on bookings(status);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Check room availability
create or replace function check_room_availability(
  p_room_id uuid,
  p_check_in date,
  p_check_out date)
returns boolean as
$
begin
  return not exists (
    select 1 from bookings
    where room_id = p_room_id
    and status in ("confirmed", "pending")
    and check_in < p_check_out
    and check_out > p_check_in
  );
end;
$ language plpgsql;

-- Generate confirmation code
create or replace function generate_confirmation_code()
returns trigger as
$
begin
  new.confirmation_code := "TM" || upper(substr(md5(random()::text), 1, 8));
  return new;
end;
$ language plpgsql;

create trigger set_confirmation_code
  before insert on bookings
  for each row execute function generate_confirmation_code();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as
$
begin
  new.updated_at = now();
  return new;
end;
$ language plpgsql;

create trigger rooms_updated_at before update on rooms for each row execute function update_updated_at();
create trigger bookings_updated_at before update on bookings for each row execute function update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table rooms enable row level security;
alter table bookings enable row level security;
alter table guests enable row level security;

-- Public can read active rooms
create policy "Public can view active rooms" on rooms for select using (is_active = true);
create policy "Public can view room images" on room_images for select using (true);
create policy "Public can view rates" on rates for select using (is_active = true);

-- Authenticated users can manage their own bookings
create policy "Users can view own bookings" on bookings for select using (auth.uid() = guest_id);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = guest_id);

