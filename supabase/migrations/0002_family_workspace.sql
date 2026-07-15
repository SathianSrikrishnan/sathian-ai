-- Parent-owned family workspace records. No child email, auth account, wallet,
-- legal name, or unit number is stored here.

create table public.lex_family_workspaces (
  owner_user_id uuid primary key references public.lex_profiles(id) on delete cascade,
  display_label text not null default 'Family Garden Lab',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint family_workspace_label_length check (char_length(display_label) between 1 and 80)
);
create table public.lex_family_helpers (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.lex_family_workspaces(owner_user_id) on delete cascade,
  handle text not null,
  color_key text not null default 'marigold' check (color_key in ('marigold', 'sky', 'leaf')),
  sort_order smallint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_user_id, handle),
  constraint family_helper_handle_length check (char_length(handle) between 1 and 40)
);
alter table public.lex_family_workspaces enable row level security;
alter table public.lex_family_helpers enable row level security;
create policy "parents manage own family workspace" on public.lex_family_workspaces
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());
create policy "parents manage own helper lex_profiles" on public.lex_family_helpers
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());
comment on table public.lex_family_helpers is
  'Parent-managed app handles only. Never store child contact details, legal names, seed phrases, or private keys.';
