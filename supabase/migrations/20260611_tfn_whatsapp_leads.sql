create extension if not exists pgcrypto;

create table if not exists public.tfn_webhook_events (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  provider text not null,
  event_type text not null default 'webhook',
  external_event_id text,
  payload jsonb not null,
  headers jsonb not null default '{}'::jsonb,
  processing_status text not null default 'received',
  error text,
  received_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tfn_channel_contacts (
  id uuid primary key default gen_random_uuid(),
  brand text not null default 'toothfairy_network',
  channel text not null,
  provider_contact_id text not null,
  display_phone text,
  display_name text,
  lead_status text not null default 'new',
  lead_type text not null default 'unknown',
  tags text[] not null default '{}'::text[],
  raw_profile jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now()),
  unique (brand, channel, provider_contact_id)
);

create table if not exists public.tfn_channel_messages (
  id uuid primary key default gen_random_uuid(),
  brand text not null default 'toothfairy_network',
  channel text not null,
  direction text not null check (direction in ('inbound', 'outbound', 'status')),
  provider_message_id text not null,
  provider_contact_id text,
  contact_id uuid references public.tfn_channel_contacts(id) on delete set null,
  message_type text not null default 'unknown',
  message_text text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (channel, direction, provider_message_id)
);

create index if not exists tfn_webhook_events_channel_received_idx
  on public.tfn_webhook_events (channel, received_at desc);

create index if not exists tfn_channel_contacts_brand_channel_status_idx
  on public.tfn_channel_contacts (brand, channel, lead_status, last_seen_at desc);

create index if not exists tfn_channel_messages_contact_received_idx
  on public.tfn_channel_messages (contact_id, received_at desc);

create index if not exists tfn_channel_messages_channel_received_idx
  on public.tfn_channel_messages (channel, received_at desc);

alter table public.tfn_webhook_events enable row level security;
alter table public.tfn_channel_contacts enable row level security;
alter table public.tfn_channel_messages enable row level security;
