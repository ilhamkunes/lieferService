-- =========================================================
-- Migration 004: Kapak foto/logo ve "Beliebt" (one cikan) urunler
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- =========================================================

alter table products add column if not exists one_cikan boolean not null default false;

alter table restaurant_settings add column if not exists kapak_foto_url text;
alter table restaurant_settings add column if not exists logo_url text;
