-- Replace browser-only blob URLs that were saved before Storage was connected.
-- Supabase Dashboard > SQL Editor > New query > paste all > Run

update public.works
set media_url = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000&q=82'
where media_url like 'blob:%';
