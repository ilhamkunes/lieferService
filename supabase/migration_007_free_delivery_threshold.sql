-- =========================================================
-- Migration 007: Teslimat bolgelerine "X Euro uzeri ucretsiz teslimat" esigi
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- =========================================================

alter table delivery_zones add column if not exists ucretsiz_esik numeric(10,2);
