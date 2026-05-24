-- ArtBus production Supabase setup
-- Run this in Supabase Dashboard > SQL Editor.
-- It configures the works table, RLS policies, and the artbus-media storage bucket.

create extension if not exists pgcrypto;

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'photo' check (category in ('photo', 'illustration', 'video', 'painting', 'ai_image', 'ai_video')),
  price integer not null default 0 check (price >= 0),
  license text not null default 'standard' check (license in ('standard', 'extended', 'exclusive')),
  tags text[] not null default '{}',
  description text not null default '',
  author_name text not null default 'ArtBus Creator',
  author_id uuid references auth.users(id) on delete set null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text not null,
  downloads integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.works add column if not exists title text not null default 'Untitled work';
alter table public.works add column if not exists category text not null default 'photo';
alter table public.works add column if not exists price integer not null default 0;
alter table public.works add column if not exists license text not null default 'standard';
alter table public.works add column if not exists tags text[] not null default '{}';
alter table public.works add column if not exists description text not null default '';
alter table public.works add column if not exists author_name text not null default 'ArtBus Creator';
alter table public.works add column if not exists author_id uuid references auth.users(id) on delete set null;
alter table public.works alter column author_id drop not null;
alter table public.works add column if not exists media_type text not null default 'image';
alter table public.works add column if not exists media_url text not null default 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000&q=82';
alter table public.works add column if not exists downloads integer not null default 0;
alter table public.works add column if not exists created_at timestamptz not null default now();

alter table public.works drop constraint if exists works_category_check;
alter table public.works add constraint works_category_check
  check (category in ('photo', 'illustration', 'video', 'painting', 'ai_image', 'ai_video'));

create index if not exists works_created_at_idx on public.works (created_at desc);
create index if not exists works_category_idx on public.works (category);
create index if not exists works_license_idx on public.works (license);
create index if not exists works_author_id_idx on public.works (author_id);

alter table public.works enable row level security;

drop policy if exists "works public read" on public.works;
create policy "works public read"
  on public.works for select
  using (true);

drop policy if exists "works owner insert" on public.works;
create policy "works owner insert"
  on public.works for insert
  to authenticated
  with check (author_id = auth.uid());

drop policy if exists "works owner update" on public.works;
create policy "works owner update"
  on public.works for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "works owner delete" on public.works;
create policy "works owner delete"
  on public.works for delete
  to authenticated
  using (author_id = auth.uid());

-- Remove older permissive draft policies if they exist.
drop policy if exists "works public insert" on public.works;
drop policy if exists "works authenticated insert" on public.works;
drop policy if exists "works authenticated delete own" on public.works;

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

insert into public.works
  (title, category, price, license, tags, description, author_name, media_type, media_url, downloads)
values
  ('네온 스카이라인', 'photo', 28000, 'extended', array['도시','야경','4K'], '광고 캠페인에 어울리는 도시 야경 이미지입니다.', 'Studio Lumen', 'image', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&q=82', 4920),
  ('몽환 수채 일러스트', 'illustration', 15000, 'standard', array['수채화','포스터'], '에디토리얼과 패키지 디자인에 어울리는 일러스트입니다.', 'Mina Park', 'image', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000&q=82', 1880),
  ('시네마틱 오션', 'video', 45000, 'extended', array['4K','자연'], '브랜드 필름에 사용할 수 있는 자연 무드 영상 에셋입니다.', 'Frame & Tide', 'image', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1000&q=82', 3812),
  ('황금 추상 회화', 'painting', 52000, 'exclusive', array['추상','인테리어'], '프리미엄 공간 브랜딩에 어울리는 파인아트 에셋입니다.', 'Studio Lumen', 'image', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000&q=82', 902)
on conflict do nothing;
