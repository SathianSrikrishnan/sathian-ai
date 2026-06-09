import type { SupabaseClient } from "@supabase/supabase-js"

import { supabaseAdmin } from "@/lib/supabase"
import {
  MAGIC_GENERATION_COST_USD,
  MAGIC_MODEL,
  MAGIC_PROVIDER,
  STARTER_MAGIC_CREDITS,
  type MagicStyleId,
} from "@/lib/toothfairy/magic-studio"

export interface MagicCreditAccount {
  userId: string
  userEmail: string | null
  lifetimeCredits: number
  remainingCredits: number
  reservedCredits: number
  usedCredits: number
}

interface MagicCreditRow {
  user_id?: string
  user_email?: string | null
  lifetime_credits: number
  remaining_credits: number
  reserved_credits: number
  used_credits: number
}

interface CreditMutationError {
  code?: string
  message?: string
  details?: string
}

type MagicCreditMetadata = Partial<{
  lifetimeCredits: number
  remainingCredits: number
  reservedCredits: number
  usedCredits: number
}>

function mapCreditRow(row: MagicCreditRow, userId: string): MagicCreditAccount {
  return {
    userId: row.user_id ?? userId,
    userEmail: row.user_email ?? null,
    lifetimeCredits: row.lifetime_credits,
    remainingCredits: row.remaining_credits,
    reservedCredits: row.reserved_credits,
    usedCredits: row.used_credits,
  }
}

function firstRpcRow(data: unknown): MagicCreditRow | null {
  if (Array.isArray(data)) return (data[0] as MagicCreditRow | undefined) ?? null
  return (data as MagicCreditRow | null) ?? null
}

function isMissingCreditStoreError(error: CreditMutationError): boolean {
  const message = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase()
  return (
    error.code === "42P01" ||
    error.code === "42883" ||
    error.code === "PGRST202" ||
    error.code === "PGRST205" ||
    message.includes("tfn_magic_credits") ||
    message.includes("tfn_magic_generations") ||
    message.includes("tfn_reserve_magic_credit") ||
    message.includes("tfn_complete_magic_credit") ||
    message.includes("tfn_refund_magic_credit")
  )
}

function coerceAccount(
  userId: string,
  userEmail: string | null,
  raw: MagicCreditMetadata | null | undefined
): MagicCreditAccount {
  const lifetimeCredits =
    typeof raw?.lifetimeCredits === "number"
      ? Math.max(STARTER_MAGIC_CREDITS, raw.lifetimeCredits)
      : STARTER_MAGIC_CREDITS
  const usedCredits =
    typeof raw?.usedCredits === "number" ? Math.max(0, raw.usedCredits) : 0
  const reservedCredits =
    typeof raw?.reservedCredits === "number"
      ? Math.max(0, raw.reservedCredits)
      : 0
  const remainingCredits =
    typeof raw?.remainingCredits === "number"
      ? Math.max(0, raw.remainingCredits)
      : Math.max(0, lifetimeCredits - usedCredits - reservedCredits)

  return {
    userId,
    userEmail,
    lifetimeCredits,
    remainingCredits,
    reservedCredits,
    usedCredits,
  }
}

async function readMetadataAccount(
  userId: string,
  userEmail?: string | null
): Promise<MagicCreditAccount> {
  if (!supabaseAdmin) {
    throw new Error("Magic credit fallback needs SUPABASE_SERVICE_ROLE_KEY")
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)
  if (error) throw error

  const appMetadata = (data.user?.app_metadata ?? {}) as Record<string, unknown>
  const raw = appMetadata.tfn_magic_credits as MagicCreditMetadata | undefined
  const account = coerceAccount(
    userId,
    userEmail ?? data.user?.email ?? null,
    raw
  )

  if (!raw) {
    await writeMetadataAccount(account, appMetadata)
  }

  return account
}

async function writeMetadataAccount(
  account: MagicCreditAccount,
  existingAppMetadata?: Record<string, unknown>
): Promise<MagicCreditAccount> {
  if (!supabaseAdmin) {
    throw new Error("Magic credit fallback needs SUPABASE_SERVICE_ROLE_KEY")
  }

  const currentMetadata =
    existingAppMetadata ??
    ((await supabaseAdmin.auth.admin.getUserById(account.userId)).data.user
      ?.app_metadata as Record<string, unknown> | undefined) ??
    {}

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    account.userId,
    {
      app_metadata: {
        ...currentMetadata,
        tfn_magic_credits: {
          lifetimeCredits: account.lifetimeCredits,
          remainingCredits: account.remainingCredits,
          reservedCredits: account.reservedCredits,
          usedCredits: account.usedCredits,
        },
      },
    }
  )

  if (error) throw error
  return account
}

async function mutateMetadataAccount(
  userId: string,
  update: (account: MagicCreditAccount) => MagicCreditAccount | null
): Promise<MagicCreditAccount | null> {
  const account = await readMetadataAccount(userId)
  const next = update(account)
  if (!next) return null
  return writeMetadataAccount(next)
}

export async function getOrCreateMagicCreditAccount(
  supabase: SupabaseClient,
  userId: string,
  userEmail?: string | null
): Promise<MagicCreditAccount> {
  const { error: upsertError } = await supabase
    .from("tfn_magic_credits")
    .upsert(
      {
        user_id: userId,
        user_email: userEmail ?? null,
        lifetime_credits: STARTER_MAGIC_CREDITS,
        remaining_credits: STARTER_MAGIC_CREDITS,
        reserved_credits: 0,
        used_credits: 0,
      },
      { onConflict: "user_id", ignoreDuplicates: true }
    )

  if (upsertError) {
    if (isMissingCreditStoreError(upsertError)) {
      return readMetadataAccount(userId, userEmail)
    }
    throw upsertError
  }

  const { data, error } = await supabase
    .from("tfn_magic_credits")
    .select(
      "user_id,user_email,lifetime_credits,remaining_credits,reserved_credits,used_credits"
    )
    .eq("user_id", userId)
    .single()

  if (error) {
    if (isMissingCreditStoreError(error)) {
      return readMetadataAccount(userId, userEmail)
    }
    throw error
  }
  return mapCreditRow(data as MagicCreditRow, userId)
}

export async function reserveMagicCredit(
  supabase: SupabaseClient,
  userId: string
): Promise<MagicCreditAccount | null> {
  const { data, error } = await supabase.rpc("tfn_reserve_magic_credit", {
    p_user_id: userId,
  })

  if (error) {
    if (isMissingCreditStoreError(error)) {
      return mutateMetadataAccount(userId, (account) => {
        if (account.remainingCredits <= 0) return null
        return {
          ...account,
          remainingCredits: account.remainingCredits - 1,
          reservedCredits: account.reservedCredits + 1,
        }
      })
    }
    throw error
  }
  const row = firstRpcRow(data)
  return row ? mapCreditRow(row, userId) : null
}

export async function completeMagicCredit(
  supabase: SupabaseClient,
  userId: string
): Promise<MagicCreditAccount> {
  const { data, error } = await supabase.rpc("tfn_complete_magic_credit", {
    p_user_id: userId,
  })

  if (error) {
    if (isMissingCreditStoreError(error)) {
      const account = await mutateMetadataAccount(userId, (current) => {
        if (current.reservedCredits <= 0) return null
        return {
          ...current,
          reservedCredits: current.reservedCredits - 1,
          usedCredits: current.usedCredits + 1,
        }
      })
      if (!account) throw new Error("No reserved magic credit to complete")
      return account
    }
    throw error
  }
  const row = firstRpcRow(data)
  if (!row) throw new Error("No reserved magic credit to complete")
  return mapCreditRow(row, userId)
}

export async function refundMagicCredit(
  supabase: SupabaseClient,
  userId: string
): Promise<MagicCreditAccount | null> {
  const { data, error } = await supabase.rpc("tfn_refund_magic_credit", {
    p_user_id: userId,
  })

  if (error) {
    if (isMissingCreditStoreError(error)) {
      return mutateMetadataAccount(userId, (account) => {
        if (account.reservedCredits <= 0) return null
        return {
          ...account,
          remainingCredits: account.remainingCredits + 1,
          reservedCredits: account.reservedCredits - 1,
        }
      })
    }
    throw error
  }
  const row = firstRpcRow(data)
  return row ? mapCreditRow(row, userId) : null
}

export async function logMagicGeneration(
  supabase: SupabaseClient,
  input: {
    userId: string
    styleId: MagicStyleId
    traditionSlug: string
    prompt: string
    enhancedImageUrl: string
    generationMs: number
    originalBytes: number
    modelUsed?: string
    renderMode?: string
  }
): Promise<void> {
  const { error } = await supabase.from("tfn_magic_generations").insert({
    user_id: input.userId,
    style_id: input.styleId,
    tradition_slug: input.traditionSlug,
    provider: MAGIC_PROVIDER,
    model: input.modelUsed ?? MAGIC_MODEL,
    prompt: input.prompt,
    enhanced_image_url: input.enhancedImageUrl,
    generation_ms: input.generationMs,
    cost_usd: MAGIC_GENERATION_COST_USD,
    original_bytes: input.originalBytes,
    credit_status: "spent",
  })

  if (error && !isMissingCreditStoreError(error)) throw error
}
