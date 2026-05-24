-- ArtBus media storage.
-- Supabase Dashboard > SQL Editor > New query > paste all > Run

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artbus-media',
  'artbus-media',
  true,
  104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "artbus media public read" on storage.objects;
create policy "artbus media public read"
  on storage.objects for select
  using (bucket_id = 'artbus-media');

drop policy if exists "artbus media authenticated upload" on storage.objects;
create policy "artbus media authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'artbus-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "artbus media owner update" on storage.objects;
create policy "artbus media owner update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'artbus-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'artbus-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "artbus media owner delete" on storage.objects;
create policy "artbus media owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'artbus-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
