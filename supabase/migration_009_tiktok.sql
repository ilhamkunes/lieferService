-- =========================================================
-- Migration 009: Restoran ayarlarina TikTok linki ekle
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- =========================================================

alter table restaurant_settings add column if not exists tiktok_url text;
