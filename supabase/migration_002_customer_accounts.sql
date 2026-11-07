-- =========================================================
-- Migration 002: Musteri hesaplari (giris + kayitli adresler)
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- (Prompt 1'deki supabase/schema.sql zaten calistirilmis olmali.)
-- =========================================================

-- ---------------------------------------------------------
-- 1. admins - hangi giris yapan kullanicinin admin (restoran
-- sahibi) oldugunu tutar. Panel kurulumunda (Prompt 5) elle
-- bir satir eklenecek.
-- ---------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table admins enable row level security;
-- Bilerek hicbir public policy yok: sadece service_role okuyup yazabilir.

-- RLS politikalarinda guvenli admin kontrolu icin yardimci fonksiyon.
-- security definer: admins tablosunu RLS'e takilmadan okuyabilsin.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------
-- 2. customer_addresses - musterilerin kayitli teslimat adresleri
-- ---------------------------------------------------------
create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  musteri_id uuid not null references auth.users(id) on delete cascade,
  etiket text not null default 'Zuhause',
  sokak text not null,
  numara text not null,
  posta_kodu text not null,
  sehir text not null,
  kapi_kat_notu text,
  created_at timestamptz not null default now()
);

create index if not exists customer_addresses_musteri_id_idx on customer_addresses(musteri_id);

alter table customer_addresses enable row level security;

drop policy if exists "musteri kendi adreslerini gorur" on customer_addresses;
create policy "musteri kendi adreslerini gorur" on customer_addresses
  for select using (is_admin() or musteri_id = auth.uid());

drop policy if exists "musteri kendi adresini ekler" on customer_addresses;
create policy "musteri kendi adresini ekler" on customer_addresses
  for insert with check (musteri_id = auth.uid());

drop policy if exists "musteri kendi adresini gunceller" on customer_addresses;
create policy "musteri kendi adresini gunceller" on customer_addresses
  for update using (musteri_id = auth.uid());

drop policy if exists "musteri kendi adresini siler" on customer_addresses;
create policy "musteri kendi adresini siler" on customer_addresses
  for delete using (musteri_id = auth.uid());

-- ---------------------------------------------------------
-- 3. orders: siparisin hangi musteri hesabina ait oldugunu tutar
-- (giris yapmadan verilen siparislerde bos kalir)
-- ---------------------------------------------------------
alter table orders add column if not exists musteri_id uuid references auth.users(id);
create index if not exists orders_musteri_id_idx on orders(musteri_id);

-- ---------------------------------------------------------
-- 4. ONEMLI DUZELTME: "authenticated" rolu artik sadece admin
-- degil, giris yapmis musteriler de olabilir. Eski politikalar
-- "auth.role() = 'authenticated'" kullaniyordu; bu HERKESE giris
-- yapan tum siparisleri gosterirdi. is_admin() ile degistiriyoruz.
-- ---------------------------------------------------------
drop policy if exists "admin siparisleri gorebilir" on orders;
create policy "siparisleri gorme" on orders
  for select using (is_admin() or musteri_id = auth.uid());

drop policy if exists "admin siparisleri guncelleyebilir" on orders;
create policy "admin siparisleri gunceller" on orders
  for update using (is_admin());

drop policy if exists "admin siparis kalemlerini gorebilir" on order_items;
create policy "siparis kalemlerini gorme" on order_items
  for select using (
    is_admin()
    or exists (
      select 1 from orders o
      where o.id = order_items.siparis_id and o.musteri_id = auth.uid()
    )
  );

drop policy if exists "admin kategori ekler" on categories;
create policy "admin kategori ekler" on categories for insert with check (is_admin());
drop policy if exists "admin kategori guncelleyebilir" on categories;
create policy "admin kategori gunceller" on categories for update using (is_admin());
drop policy if exists "admin kategori silebilir" on categories;
create policy "admin kategori siler" on categories for delete using (is_admin());

drop policy if exists "admin urun ekler" on products;
create policy "admin urun ekler" on products for insert with check (is_admin());
drop policy if exists "admin urun guncelleyebilir" on products;
create policy "admin urun gunceller" on products for update using (is_admin());
drop policy if exists "admin urun silebilir" on products;
create policy "admin urun siler" on products for delete using (is_admin());

drop policy if exists "admin bolge ekler" on delivery_zones;
create policy "admin bolge ekler" on delivery_zones for insert with check (is_admin());
drop policy if exists "admin bolge guncelleyebilir" on delivery_zones;
create policy "admin bolge gunceller" on delivery_zones for update using (is_admin());
drop policy if exists "admin bolge silebilir" on delivery_zones;
create policy "admin bolge siler" on delivery_zones for delete using (is_admin());

drop policy if exists "admin saat ekler" on opening_hours;
create policy "admin saat ekler" on opening_hours for insert with check (is_admin());
drop policy if exists "admin saat guncelleyebilir" on opening_hours;
create policy "admin saat gunceller" on opening_hours for update using (is_admin());
