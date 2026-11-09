-- =========================================================
-- Migration 006: Restoran iletisim bilgileri (telefon, adres, Instagram)
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- =========================================================

alter table restaurant_settings add column if not exists telefon text;
alter table restaurant_settings add column if not exists adres text;
alter table restaurant_settings add column if not exists instagram_url text;
