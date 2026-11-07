-- =========================================================
-- Migration 003: Restoran paneli icin veritabani eklemeleri
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- =========================================================

-- ---------------------------------------------------------
-- 1. restaurant_settings - tek satirlik genel ayarlar
-- ---------------------------------------------------------
create table if not exists restaurant_settings (
  id int primary key default 1,
  manuel_kapatma boolean not null default false,
  teslimat_durduruldu boolean not null default false,
  gelal_durduruldu boolean not null default false,
  hazirlik_dakika int not null default 20,
  teslimat_dakika int not null default 30,
  constraint tek_satir check (id = 1)
);

insert into restaurant_settings (id) values (1) on conflict (id) do nothing;

alter table restaurant_settings enable row level security;

drop policy if exists "ayarlar herkes okur" on restaurant_settings;
create policy "ayarlar herkes okur" on restaurant_settings for select using (true);

drop policy if exists "ayarlar admin gunceller" on restaurant_settings;
create policy "ayarlar admin gunceller" on restaurant_settings for update using (is_admin());

-- ---------------------------------------------------------
-- 2. orders: kabul edilince tahmini hazir saati, reddedilince sebebi
-- ---------------------------------------------------------
alter table orders add column if not exists tahmini_hazir_saat timestamptz;
alter table orders add column if not exists red_sebebi text;

-- ---------------------------------------------------------
-- 3. is_admin() fonksiyonunu anon/authenticated rollerin
-- RPC olarak cagirabilmesi icin yetki ver (panelde "ben admin miyim"
-- kontrolu icin kullanilacak, admins tablosunun kendisi hala gizli).
-- ---------------------------------------------------------
grant execute on function is_admin() to anon, authenticated;

-- ---------------------------------------------------------
-- 4. Realtime: yeni siparisler anlik dusmesi icin orders tablosunu
-- supabase_realtime yayinina ekle.
-- ---------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table orders;
exception when duplicate_object then null; end $$;
