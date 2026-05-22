import type {
  FamilyNodeKind,
  ToothlightVisualState,
} from '@/lib/toothlight/toothlight-states'

export type ToothlightFamilyNode = {
  id: string
  kind: FamilyNodeKind
  label?: string
}

export type ToothlightCardProps = {
  imageSrc?: string | null
  title: string
  caption?: string
  createdLabel?: string
  visualState?: ToothlightVisualState
  familyNodes?: ToothlightFamilyNode[]
  smileFundActive?: boolean
  className?: string
}
