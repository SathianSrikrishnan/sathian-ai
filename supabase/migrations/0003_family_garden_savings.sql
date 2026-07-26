-- Parent-managed family care and Solana savings records.
-- Public addresses and transaction signatures are allowed. Recovery phrases,
-- private keys, child auth accounts, and child contact details are not.

alter table public.lex_family_helpers
  add constraint family_helpers_id_owner_unique unique (id, owner_user_id);
create table public.lex_family_wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.lex_family_workspaces(owner_user_id) on delete cascade,
  helper_id uuid not null,
  network text not null default 'solana-devnet'
    check (network in ('solana-devnet', 'solana-mainnet')),
  public_address text not null,
  custody_model text not null default 'parent_phantom_account'
    check (custody_model in ('parent_phantom_account')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (helper_id, owner_user_id)
    references public.lex_family_helpers(id, owner_user_id) on delete cascade,
  unique (owner_user_id, helper_id, network),
  unique (id, owner_user_id, helper_id),
  constraint family_wallet_public_address_length
    check (char_length(public_address) between 32 and 44),
  constraint family_wallet_public_address_characters
    check (public_address ~ '^[1-9A-HJ-NP-Za-km-z]+$')
);
create table public.lex_family_care_entries (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.lex_family_workspaces(owner_user_id) on delete cascade,
  helper_id uuid not null,
  mission_key text not null
    check (mission_key in ('water', 'soil-check', 'plant-seed', 'harvest', 'meal-story')),
  points_awarded integer not null check (points_awarded between 0 and 100),
  note text not null default '',
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (helper_id, owner_user_id)
    references public.lex_family_helpers(id, owner_user_id) on delete cascade,
  unique (id, owner_user_id, helper_id),
  constraint family_care_note_length check (char_length(note) <= 240)
);
create table public.lex_family_wallet_settlements (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.lex_family_workspaces(owner_user_id) on delete cascade,
  helper_id uuid not null,
  wallet_account_id uuid not null,
  network text not null default 'solana-devnet'
    check (network in ('solana-devnet', 'solana-mainnet')),
  amount_lamports bigint not null check (amount_lamports > 0),
  points_recognized integer not null check (points_recognized >= 0),
  transaction_signature text not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'confirmed', 'failed')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  foreign key (helper_id, owner_user_id)
    references public.lex_family_helpers(id, owner_user_id) on delete cascade,
  foreign key (wallet_account_id, owner_user_id, helper_id)
    references public.lex_family_wallet_accounts(id, owner_user_id, helper_id) on delete restrict,
  unique (network, transaction_signature),
  unique (id, owner_user_id, helper_id),
  constraint family_wallet_signature_length
    check (char_length(transaction_signature) between 32 and 128)
);
alter table public.lex_family_care_entries
  add column settlement_id uuid,
  add constraint family_care_settlement_owner_fkey
    foreign key (settlement_id, owner_user_id, helper_id)
    references public.lex_family_wallet_settlements(id, owner_user_id, helper_id)
    on delete set null (settlement_id);
alter table public.lex_family_wallet_accounts enable row level security;
alter table public.lex_family_care_entries enable row level security;
alter table public.lex_family_wallet_settlements enable row level security;
create policy "parents manage own family wallet accounts" on public.lex_family_wallet_accounts
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());
create policy "parents manage own family care entries" on public.lex_family_care_entries
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());
create policy "parents manage own family wallet settlements" on public.lex_family_wallet_settlements
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());
comment on table public.lex_family_wallet_accounts is
  'Parent-custodied accounts. Store public Solana addresses only; never store wallet secrets.';
comment on table public.lex_family_wallet_settlements is
  'Public transaction receipts for parent-approved family learning deposits.';
