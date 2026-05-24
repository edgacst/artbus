-- ArtBus v2 minimal Supabase setup
-- Supabase Dashboard > SQL Editor > New query > paste all > Run

create extension if not exists pgcrypto;

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('photo', 'illustration', 'video', 'painting')),
  price integer not null default 0 check (price >= 0),
  license text not null default 'standard' check (license in ('standard', 'extended', 'exclusive')),
  tags text[] not null default '{}',
  description text not null default '',
  author_name text not null default 'ArtBus Creator',
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text not null,
  downloads integer not null default 0,
  created_at timestamptz not null default now()
);

-- If the table was created by an earlier draft, bring it up to date.
alter table public.works add column if not exists title text not null default 'Untitled work';
alter table public.works add column if not exists category text not null default 'photo';
alter table public.works add column if not exists price integer not null default 0;
alter table public.works add column if not exists license text not null default 'standard';
alter table public.works add column if not exists tags text[] not null default '{}';
alter table public.works add column if not exists description text not null default '';
alter table public.works add column if not exists author_name text not null default 'ArtBus Creator';
alter table public.works add column if not exists author_id uuid;
alter table public.works alter column author_id drop not null;
alter table public.works add column if not exists media_type text not null default 'image';
alter table public.works add column if not exists media_url text not null default 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000&q=82';
alter table public.works add column if not exists downloads integer not null default 0;
alter table public.works add column if not exists created_at timestamptz not null default now();

create index if not exists works_created_at_idx on public.works (created_at desc);
create index if not exists works_category_idx on public.works (category);
create index if not exists works_license_idx on public.works (license);

alter table public.works enable row level security;

drop policy if exists "works public read" on public.works;
create policy "works public read"
  on public.works for select
  using (true);

drop policy if exists "works public insert" on public.works;
create policy "works public insert"
  on public.works for insert
  with check (true);

insert into public.works
  (title, category, price, license, tags, description, author_name, media_type, media_url, downloads)
values
  ('네온 스카이라인', 'photo', 28000, 'extended', array['도시','야경','4K'], '브랜드 캠페인에 어울리는 도시 야경 이미지입니다.', 'Studio Lumen', 'image', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&q=82', 4920),
  ('몽환 수채 일러스트', 'illustration', 15000, 'standard', array['수채','파스텔'], '에디토리얼과 패키지 디자인에 어울리는 일러스트입니다.', 'Mina Park', 'image', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000&q=82', 1880),
  ('시네마틱 오션', 'video', 45000, 'extended', array['4K','자연'], '브랜드 필름에 사용할 수 있는 자연 무드 영상 에셋입니다.', 'Frame & Tide', 'image', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1000&q=82', 3812),
  ('황금 추상 회화', 'painting', 52000, 'exclusive', array['추상','인테리어'], '프리미엄 공간 브랜딩에 어울리는 파인아트 에셋입니다.', 'Studio Lumen', 'image', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000&q=82', 902)
on conflict do nothing;
