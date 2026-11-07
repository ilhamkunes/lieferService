-- =========================================================
-- Migration 005: Telefon/tablet push bildirimleri icin abonelikler
-- Bu dosyanin TAMAMINI Supabase SQL Editor'de calistirin.
-- =========================================================

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  musteri_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_musteri_id_idx on push_subscriptions(musteri_id);

alter table push_subscriptions enable row level security;

drop policy if exists "admin push aboneligini yonetir" on push_subscriptions;
create policy "admin push aboneligini yonetir" on push_subscriptions
  for all
  using (is_admin() and musteri_id = auth.uid())
  with check (is_admin() and musteri_id = auth.uid());
