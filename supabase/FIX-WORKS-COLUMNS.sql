-- Fix an existing ArtBus works table created by an older draft.
-- Supabase Dashboard > SQL Editor > New query > paste all > Run

alter table public.works add column if not exists author_name text not null default 'ArtBus Creator';
alter table public.works add column if not exists author_id uuid;
alter table public.works alter column author_id drop not null;
alter table public.works add column if not exists media_type text not null default 'image';
alter table public.works add column if not exists media_url text not null default 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000&q=82';
alter table public.works add column if not exists downloads integer not null default 0;
alter table public.works add column if not exists tags text[] not null default '{}';
alter table public.works add column if not exists description text not null default '';
alter table public.works add column if not exists license text not null default 'standard';
alter table public.works add column if not exists price integer not null default 0;
alter table public.works add column if not exists category text not null default 'photo';
alter table public.works add column if not exists title text not null default 'Untitled work';
alter table public.works add column if not exists created_at timestamptz not null default now();

alter table public.works enable row level security;

drop policy if exists "works public read" on public.works;
create policy "works public read"
  on public.works for select
  using (true);

drop policy if exists "works public insert" on public.works;
create policy "works public insert"
  on public.works for insert
  with check (true);
