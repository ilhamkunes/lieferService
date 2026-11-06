-- =========================================================
-- Restoran Online Siparis Sistemi - Supabase Sema
-- Bu dosyanin TAMAMINI Supabase projenizde SQL Editor'e
-- yapistirip calistirin (Supabase Dashboard > SQL Editor > New query).
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1. categories
-- ---------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  sira int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. products
-- ---------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  kategori_id uuid not null references categories(id) on delete restrict,
  isim text not null,
  aciklama text,
  fiyat numeric(10,2) not null check (fiyat >= 0),
  fotograf_url text,
  alerjenler text[] not null default '{}',
  katki_maddeleri text[] not null default '{}',
  mevcut_mu boolean not null default true,
  sira int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_kategori_id_idx on products(kategori_id);

-- ---------------------------------------------------------
-- 3. delivery_zones
-- ---------------------------------------------------------
create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  posta_kodu text not null unique,
  teslimat_ucreti numeric(10,2) not null check (teslimat_ucreti >= 0),
  minimum_siparis numeric(10,2) not null check (minimum_siparis >= 0),
  aktif boolean not null default true
);

-- ---------------------------------------------------------
-- 4. opening_hours
-- ---------------------------------------------------------
create table if not exists opening_hours (
  id uuid primary key default gen_random_uuid(),
  gun smallint not null check (gun between 0 and 6), -- 0=Pazar ... 6=Cumartesi
  acilis time not null,
  kapanis time not null,
  kapali boolean not null default false,
  unique (gun)
);

-- ---------------------------------------------------------
-- 5. orders
-- ---------------------------------------------------------
do $$ begin
  create type order_turu as enum ('teslimat', 'gelal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type odeme_yontemi as enum ('paypal', 'nakit_veya_kart');
exception when duplicate_object then null; end $$;

do $$ begin
  create type odeme_durumu as enum ('bekliyor', 'odendi', 'basarisiz');
exception when duplicate_object then null; end $$;

do $$ begin
  create type siparis_durumu as enum ('yeni', 'hazirlaniyor', 'teslime_hazir', 'tamamlandi', 'reddedildi');
exception when duplicate_object then null; end $$;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  siparis_no text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  musteri_adi text not null,
  telefon text not null,
  eposta text not null,
  tur order_turu not null,
  -- teslimat alanlari (tur = 'teslimat' oldugunda doldurulur)
  sokak text,
  numara text,
  posta_kodu text,
  sehir text,
  kapi_kat_notu text,
  -- gelal alani (tur = 'gelal' oldugunda doldurulur)
  alma_saati timestamptz,
  odeme_yontemi odeme_yontemi not null,
  odeme_durumu odeme_durumu not null default 'bekliyor',
  paypal_islem_no text,
  siparis_durumu siparis_durumu not null default 'yeni',
  ara_toplam numeric(10,2) not null check (ara_toplam >= 0),
  teslimat_ucreti numeric(10,2) not null default 0 check (teslimat_ucreti >= 0),
  toplam numeric(10,2) not null check (toplam >= 0),
  not_metni text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists orders_siparis_durumu_idx on orders(siparis_durumu);

-- ---------------------------------------------------------
-- 6. order_items
-- ---------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  siparis_id uuid not null references orders(id) on delete cascade,
  urun_id uuid not null references products(id),
  urun_adi text not null, -- siparis anindaki isim (urun sonra degisse de siparis degismesin)
  adet int not null check (adet > 0),
  birim_fiyat numeric(10,2) not null check (birim_fiyat >= 0)
);

create index if not exists order_items_siparis_id_idx on order_items(siparis_id);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table delivery_zones enable row level security;
alter table opening_hours enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Herkes (musteriler dahil) menuyu okuyabilir
drop policy if exists "menu okunabilir - categories" on categories;
create policy "menu okunabilir - categories" on categories for select using (true);

drop policy if exists "menu okunabilir - products" on products;
create policy "menu okunabilir - products" on products for select using (true);

drop policy if exists "menu okunabilir - delivery_zones" on delivery_zones;
create policy "menu okunabilir - delivery_zones" on delivery_zones for select using (true);

drop policy if exists "menu okunabilir - opening_hours" on opening_hours;
create policy "menu okunabilir - opening_hours" on opening_hours for select using (true);

-- Musteriler siparis olusturabilir (insert), ama siparisleri sadece admin (giris yapmis kullanici) gorebilir
drop policy if exists "musteri siparis olusturabilir" on orders;
create policy "musteri siparis olusturabilir" on orders for insert with check (true);

drop policy if exists "musteri siparis kalemi olusturabilir" on order_items;
create policy "musteri siparis kalemi olusturabilir" on order_items for insert with check (true);

drop policy if exists "admin siparisleri gorebilir" on orders;
create policy "admin siparisleri gorebilir" on orders for select using (auth.role() = 'authenticated');

drop policy if exists "admin siparisleri guncelleyebilir" on orders;
create policy "admin siparisleri guncelleyebilir" on orders for update using (auth.role() = 'authenticated');

drop policy if exists "admin siparis kalemlerini gorebilir" on order_items;
create policy "admin siparis kalemlerini gorebilir" on order_items for select using (auth.role() = 'authenticated');

-- Menu / ayar yonetimi sadece admin (giris yapmis kullanici)
drop policy if exists "admin kategori ekler" on categories;
create policy "admin kategori ekler" on categories for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin kategori guncelleyebilir" on categories;
create policy "admin kategori guncelleyebilir" on categories for update using (auth.role() = 'authenticated');
drop policy if exists "admin kategori silebilir" on categories;
create policy "admin kategori silebilir" on categories for delete using (auth.role() = 'authenticated');

drop policy if exists "admin urun ekler" on products;
create policy "admin urun ekler" on products for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin urun guncelleyebilir" on products;
create policy "admin urun guncelleyebilir" on products for update using (auth.role() = 'authenticated');
drop policy if exists "admin urun silebilir" on products;
create policy "admin urun silebilir" on products for delete using (auth.role() = 'authenticated');

drop policy if exists "admin bolge ekler" on delivery_zones;
create policy "admin bolge ekler" on delivery_zones for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin bolge guncelleyebilir" on delivery_zones;
create policy "admin bolge guncelleyebilir" on delivery_zones for update using (auth.role() = 'authenticated');
drop policy if exists "admin bolge silebilir" on delivery_zones;
create policy "admin bolge silebilir" on delivery_zones for delete using (auth.role() = 'authenticated');

drop policy if exists "admin saat ekler" on opening_hours;
create policy "admin saat ekler" on opening_hours for insert with check (auth.role() = 'authenticated');
drop policy if exists "admin saat guncelleyebilir" on opening_hours;
create policy "admin saat guncelleyebilir" on opening_hours for update using (auth.role() = 'authenticated');

-- =========================================================
-- Ornek test verisi (gercek menu girilince silinebilir/degistirilebilir)
-- =========================================================
insert into categories (isim, sira) values
  ('Vorspeisen', 1),
  ('Hauptgerichte', 2),
  ('Getraenke', 3);

do $$
declare
  cat_vorspeisen uuid;
  cat_haupt uuid;
  cat_getranke uuid;
begin
  select id into cat_vorspeisen from categories where isim = 'Vorspeisen';
  select id into cat_haupt from categories where isim = 'Hauptgerichte';
  select id into cat_getranke from categories where isim = 'Getraenke';

  insert into products (kategori_id, isim, aciklama, fiyat, alerjenler, mevcut_mu, sira) values
    (cat_vorspeisen, 'Gemischter Salat', 'Frischer Salat mit Hausdressing', 5.50, '{}', true, 1),
    (cat_vorspeisen, 'Tomatensuppe', 'Hausgemachte Tomatensuppe', 4.90, '{"Sellerie"}', true, 2),
    (cat_haupt, 'Margherita Pizza', 'Tomate, Mozzarella, Basilikum', 8.90, '{"Gluten","Laktose"}', true, 1),
    (cat_haupt, 'Doener Teller', 'Doener mit Reis und Salat', 11.50, '{}', true, 2),
    (cat_getranke, 'Ayran', '0,33l', 2.50, '{"Laktose"}', true, 1),
    (cat_getranke, 'Cola', '0,33l', 2.80, '{}', true, 2);
end $$;

insert into delivery_zones (posta_kodu, teslimat_ucreti, minimum_siparis) values
  ('10115', 2.50, 15.00),
  ('10117', 2.50, 15.00),
  ('10119', 3.00, 20.00);

insert into opening_hours (gun, acilis, kapanis) values
  (0, '12:00', '22:00'),
  (1, '11:00', '22:00'),
  (2, '11:00', '22:00'),
  (3, '11:00', '22:00'),
  (4, '11:00', '22:00'),
  (5, '11:00', '23:00'),
  (6, '12:00', '23:00');
