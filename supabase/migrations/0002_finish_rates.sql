-- Finish rates for the residential Construction Cost Calculator.
-- Future-proof: any number of finishes can be added/edited/removed in studio.

create table if not exists public.finish_rates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  rate_per_sqm numeric(12, 2) not null check (rate_per_sqm > 0),
  sort_order int not null default 0,
  is_active boolean not null default true
);

create index if not exists finish_rates_active_sort_idx
  on public.finish_rates (is_active, sort_order);

alter table public.finish_rates enable row level security;

-- Public calculator only needs the active list.
drop policy if exists "anyone reads active finish rates" on public.finish_rates;
create policy "anyone reads active finish rates"
  on public.finish_rates for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "admin inserts finish rates" on public.finish_rates;
create policy "admin inserts finish rates"
  on public.finish_rates for insert
  to authenticated
  with check (true);

drop policy if exists "admin updates finish rates" on public.finish_rates;
create policy "admin updates finish rates"
  on public.finish_rates for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin deletes finish rates" on public.finish_rates;
create policy "admin deletes finish rates"
  on public.finish_rates for delete
  to authenticated
  using (true);

-- Seed the four residential finish tiers from the studio rate sheet.
insert into public.finish_rates (name, slug, rate_per_sqm, sort_order, is_active)
values
  ('Bare Finish', 'bare', 25000, 10, true),
  ('Standard Finish', 'standard', 35000, 20, true),
  ('Premium Finish', 'premium', 45000, 30, true),
  ('Luxury Finish', 'luxury', 80000, 40, true)
on conflict (slug) do nothing;
