export type FamilyContributionInput = {
  toothlightId: string
  contributorName?: string
  noteText?: string
  giftAmountCents?: number
  includeGift?: boolean
}

export function validateFamilyContribution(input: FamilyContributionInput) {
  const contributorName = clean(input.contributorName, 60) || 'Family'
  const noteText = clean(input.noteText, 500)
  const giftAmountCents = Number.isFinite(input.giftAmountCents)
    ? Math.max(0, Math.round(input.giftAmountCents ?? 0))
    : 0
  const hasGift = Boolean(input.includeGift && giftAmountCents > 0)
  const hasNote = Boolean(noteText)
  const nodeKind = hasGift && hasNote ? 'family_note_gift' : hasGift ? 'family_gift' : 'family_note'

  return {
    toothlightId: input.toothlightId,
    contributorName,
    noteText,
    giftAmountCents,
    nodeKind,
    noteOnly: !hasGift,
    payment_status: 'demo',
  }
}

export function demoFamilyContribution(input: FamilyContributionInput) {
  const validated = validateFamilyContribution(input)
  return {
    success: true,
    contributionId: 'demo-family-contribution',
    ...validated,
  }
}

function clean(value: string | undefined, maxLength: number) {
  return value?.replace(/\s+/g, ' ').trim().slice(0, maxLength) ?? ''
}
