-- MGC Architecture — inquiries/bookings + CMS content + media storage

-- ---------------------------------------------------------------------------
-- Inquiries & bookings (public form submissions, managed in the admin studio)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  service text,
  location text,
  budget text,
  preferred_date date,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'booked', 'archived')),
  admin_notes text
);

alter table public.inquiries enable row level security;

-- Anyone may submit an inquiry; only the signed-in admin may read/manage.
create policy "public can submit inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "admin reads inquiries"
  on public.inquiries for select
  to authenticated
  using (true);

create policy "admin updates inquiries"
  on public.inquiries for update
  to authenticated
  using (true)
  with check (true);

create policy "admin deletes inquiries"
  on public.inquiries for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- CMS content — one row per landing-page section, JSONB payload
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "anyone reads site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "admin inserts site content"
  on public.site_content for insert
  to authenticated
  with check (true);

create policy "admin updates site content"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

create policy "admin deletes site content"
  on public.site_content for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for CMS-uploaded images (public read, admin write)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

create policy "public reads site media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site');

create policy "admin uploads site media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site');

create policy "admin updates site media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site');

create policy "admin deletes site media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site');
