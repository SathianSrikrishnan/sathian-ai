-- Writing Studio: Articles table
-- Run this in Supabase Dashboard > SQL Editor

create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  title_highlight text,
  slug text unique not null,
  date text not null,
  author text not null default 'Sathian',
  domains text[] not null default '{}',
  description text not null,
  read_time text not null,
  body text not null,
  pull_quotes text[] not null default '{}',
  theme jsonb not null,
  media jsonb default '[]',
  section_headings text[] default '{}',
  section_tints text[] default '{}',
  special_elements jsonb default '[]',
  text_highlights jsonb default '[]',
  hidden_signal text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: anon can read published, service_role bypasses RLS entirely
alter table articles enable row level security;

drop policy if exists "Public can read published" on articles;
create policy "Public can read published" on articles
  for select using (status = 'published');

-- Note: service_role key bypasses RLS entirely, no policy needed for admin access
