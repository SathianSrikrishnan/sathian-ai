-- Lex Rooftop Garden schema inside Sathian's shared personal Supabase project.
-- Every app-owned object is prefixed with lex_ to preserve project isolation.

create extension if not exists pgcrypto;
create type public.lex_approval_status as enum ('pending', 'approved', 'rejected', 'blocked');
create type public.lex_app_role as enum ('visitor', 'approved_resident', 'contributor', 'admin');
create type public.lex_photo_visibility as enum ('private', 'public', 'public_share_allowed', 'lab_allowed');
create type public.lex_moderation_status as enum ('pending', 'approved', 'rejected', 'needs_edit');
create table public.lex_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  lex_approval_status public.lex_approval_status not null default 'pending',
  role public.lex_app_role not null default 'visitor',
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint display_name_length check (char_length(display_name) <= 80)
);
create table public.lex_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.lex_profiles(id) on delete cascade,
  interests text[] not null default '{}',
  message text,
  status public.lex_approval_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id)
);
create table public.lex_photos (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.lex_profiles(id) on delete cascade,
  storage_path text not null,
  caption text not null,
  plant_id uuid,
  visibility public.lex_photo_visibility not null default 'private',
  lex_moderation_status public.lex_moderation_status not null default 'pending',
  consent_confirmed boolean not null default false,
  risk_flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint photo_caption_length check (char_length(caption) between 1 and 240),
  constraint photo_requires_consent check (consent_confirmed)
);
create table public.lex_plants (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  plant_type text,
  pod_label text,
  public_description text,
  private_notes text,
  map_zone text,
  owner_user_id uuid references public.lex_profiles(id) on delete set null,
  approved_for_private_map boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.lex_photos
  add constraint photos_plant_id_fkey foreign key (plant_id) references public.lex_plants(id) on delete set null;
create table public.lex_garden_missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  task_type text not null check (task_type in ('water', 'soil_check', 'prune', 'harvest', 'clean', 'photo', 'plant_seed', 'compost', 'meal_story')),
  plant_id uuid references public.lex_plants(id) on delete set null,
  map_zone text,
  points_value integer not null check (points_value between 0 and 100),
  assigned_to uuid references public.lex_profiles(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'submitted', 'approved', 'rejected')),
  created_by uuid not null references public.lex_profiles(id),
  created_at timestamptz not null default now(),
  due_at timestamptz
);
create table public.lex_task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.lex_garden_missions(id) on delete cascade,
  submitted_by uuid not null references public.lex_profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  note text,
  photo_id uuid references public.lex_photos(id) on delete set null,
  points_awarded integer not null default 0 check (points_awarded between 0 and 100),
  lex_approval_status public.lex_approval_status not null default 'pending',
  approved_by uuid references public.lex_profiles(id),
  approved_at timestamptz
);
create table public.lex_garden_points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.lex_profiles(id) on delete cascade,
  task_completion_id uuid references public.lex_task_completions(id) on delete set null,
  points_delta integer not null check (points_delta between -1000 and 1000),
  reason text not null,
  ledger_type text not null default 'recognition' check (ledger_type in ('recognition', 'parent_allowance', 'devnet_demo')),
  onchain_network text check (onchain_network is null or onchain_network in ('solana-devnet', 'solana-mainnet')),
  onchain_tx text,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.lex_profiles(id)
);
create table public.lex_concerns (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references public.lex_profiles(id) on delete set null,
  category text not null default 'suggestion' check (category in ('suggestion', 'concern', 'official_portal_issue', 'garden_help', 'other')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'triaged', 'replied', 'forwarded', 'closed')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint concern_message_length check (char_length(message) between 4 and 2000)
);
create table public.lex_admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.lex_profiles(id),
  action_type text not null,
  target_type text not null,
  target_id uuid,
  note text,
  created_at timestamptz not null default now()
);
create or replace function public.lex_ensure_profile(
  profile_display_name text default '',
  profile_avatar_url text default null
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.lex_profiles (id, display_name, avatar_url)
  values (
    auth.uid(),
    nullif(left(trim(coalesce(profile_display_name, '')), 80), ''),
    nullif(trim(coalesce(profile_avatar_url, '')), '')
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, public.lex_profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.lex_profiles.avatar_url),
    updated_at = now();
end;
$$;
revoke all on function public.lex_ensure_profile(text, text) from public, anon;
grant execute on function public.lex_ensure_profile(text, text) to authenticated;
create or replace function public.lex_is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.lex_profiles
    where id = auth.uid() and role = 'admin' and lex_approval_status = 'approved'
  );
$$;
create or replace function public.lex_is_approved_resident()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.lex_profiles
    where id = auth.uid() and lex_approval_status = 'approved'
  );
$$;
alter table public.lex_profiles enable row level security;
alter table public.lex_access_requests enable row level security;
alter table public.lex_photos enable row level security;
alter table public.lex_plants enable row level security;
alter table public.lex_garden_missions enable row level security;
alter table public.lex_task_completions enable row level security;
alter table public.lex_garden_points_ledger enable row level security;
alter table public.lex_concerns enable row level security;
alter table public.lex_admin_actions enable row level security;
create policy "lex_profiles read own or admin" on public.lex_profiles
  for select using (id = auth.uid() or public.lex_is_admin());
create policy "lex_profiles update own display profile" on public.lex_profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());
revoke update on public.lex_profiles from authenticated;
grant update (display_name, avatar_url, updated_at) on public.lex_profiles to authenticated;
create policy "access requests read own or admin" on public.lex_access_requests
  for select using (user_id = auth.uid() or public.lex_is_admin());
create policy "access requests insert own" on public.lex_access_requests
  for insert with check (user_id = auth.uid());
create policy "access requests update own while pending" on public.lex_access_requests
  for update using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid() and status = 'pending');
create policy "admins manage access requests" on public.lex_access_requests
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "public reads approved public lex_photos" on public.lex_photos
  for select using (
    lex_moderation_status = 'approved'
    and visibility in ('public', 'public_share_allowed')
  );
create policy "approved residents read approved board lex_photos" on public.lex_photos
  for select using (public.lex_is_approved_resident() and lex_moderation_status = 'approved');
create policy "contributors read own lex_photos" on public.lex_photos
  for select using (submitted_by = auth.uid());
create policy "approved residents submit lex_photos" on public.lex_photos
  for insert with check (public.lex_is_approved_resident() and submitted_by = auth.uid());
create policy "admins manage lex_photos" on public.lex_photos
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "public reads public plant descriptions" on public.lex_plants
  for select using (true);
create policy "admins manage lex_plants" on public.lex_plants
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "approved residents read missions" on public.lex_garden_missions
  for select using (public.lex_is_approved_resident());
create policy "admins manage missions" on public.lex_garden_missions
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "residents read own task completions" on public.lex_task_completions
  for select using (submitted_by = auth.uid() or public.lex_is_admin());
create policy "residents submit own task completions" on public.lex_task_completions
  for insert with check (public.lex_is_approved_resident() and submitted_by = auth.uid());
create policy "admins manage task completions" on public.lex_task_completions
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "users read own points" on public.lex_garden_points_ledger
  for select using (user_id = auth.uid() or public.lex_is_admin());
create policy "admins manage points" on public.lex_garden_points_ledger
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "authenticated residents submit lex_concerns" on public.lex_concerns
  for insert with check (submitted_by = auth.uid());
create policy "users read own lex_concerns" on public.lex_concerns
  for select using (submitted_by = auth.uid() or public.lex_is_admin());
create policy "admins manage lex_concerns" on public.lex_concerns
  for all using (public.lex_is_admin()) with check (public.lex_is_admin());
create policy "admins read audit trail" on public.lex_admin_actions
  for select using (public.lex_is_admin());
create policy "admins write audit trail" on public.lex_admin_actions
  for insert with check (public.lex_is_admin() and admin_user_id = auth.uid());
