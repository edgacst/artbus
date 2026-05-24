-- Admin delete permissions for ArtBus.
-- Admin email: freecompr20@gmail.com
-- Supabase Dashboard > SQL Editor > New query > paste all > Run

alter table public.works enable row level security;

drop policy if exists "works owner or admin delete" on public.works;
create policy "works owner or admin delete"
  on public.works for delete
  to authenticated
  using (
    author_id = auth.uid()
    or lower(coalesce(auth.email(), '')) = 'freecompr20@gmail.com'
  );

drop policy if exists "works owner or admin update" on public.works;
create policy "works owner or admin update"
  on public.works for update
  to authenticated
  using (
    author_id = auth.uid()
    or lower(coalesce(auth.email(), '')) = 'freecompr20@gmail.com'
  )
  with check (
    author_id = auth.uid()
    or lower(coalesce(auth.email(), '')) = 'freecompr20@gmail.com'
  );

drop policy if exists "artbus media admin delete" on storage.objects;
create policy "artbus media admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'artbus-media'
    and (
      lower(coalesce(auth.email(), '')) = 'freecompr20@gmail.com'
      or lower(coalesce(auth.jwt() ->> 'email', '')) = 'freecompr20@gmail.com'
      or lower(coalesce(current_setting('request.jwt.claim.email', true), '')) = 'freecompr20@gmail.com'
    )
  );

create or replace function public.admin_delete_work(work_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  requester_email text;
  jwt_claims jsonb;
begin
  jwt_claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  requester_email := lower(coalesce(
    auth.email(),
    auth.jwt() ->> 'email',
    jwt_claims ->> 'email',
    current_setting('request.jwt.claim.email', true),
    ''
  ));

  if requester_email <> 'freecompr20@gmail.com' then
    raise exception 'admin permission required';
  end if;

  delete from public.works
  where id = work_id;

  return found;
end;
$$;

revoke all on function public.admin_delete_work(uuid) from public;
grant execute on function public.admin_delete_work(uuid) to authenticated;

notify pgrst, 'reload schema';
