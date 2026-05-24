-- Allow creators to delete only their own works.
-- Supabase Dashboard > SQL Editor > New query > paste all > Run

alter table public.works enable row level security;

drop policy if exists "works owner delete" on public.works;
create policy "works owner delete"
  on public.works for delete
  to authenticated
  using (author_id = auth.uid());

drop policy if exists "works owner update" on public.works;
create policy "works owner update"
  on public.works for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());
