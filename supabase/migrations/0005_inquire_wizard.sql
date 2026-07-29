-- Inquire wizard support: structured payload + anon uploads into site/inquiries/

alter table public.inquiries
  add column if not exists payload jsonb;

-- Allow anonymous visitors to upload inquiry attachments under inquiries/
drop policy if exists "anon uploads inquiry attachments" on storage.objects;
create policy "anon uploads inquiry attachments"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'site'
    and (storage.foldername(name))[1] = 'inquiries'
  );
