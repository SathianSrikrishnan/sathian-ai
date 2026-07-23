import type { ReactNode } from 'react'

type SocialKind = 'instagram' | 'x' | 'linkedin' | 'youtube' | 'luma'

const paths: Record<SocialKind, ReactNode> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  x: <path d="M5 4.5 19 19.5M19 4.5 5 19.5M8.4 4.5 19 19.5M5 4.5l10.6 15" />,
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M7.5 10v7M7.5 7.2v.1M11 17v-7m0 3c.7-2 5.5-2.2 5.5 1.3V17" />
    </>
  ),
  youtube: (
    <>
      <path d="M21 12c0 2.2-.2 4.2-.6 5.1-.3.8-1 1.5-1.8 1.8-1.4.5-5.1.6-6.6.6s-5.2-.1-6.6-.6c-.8-.3-1.5-1-1.8-1.8C3.2 16.2 3 14.2 3 12s.2-4.2.6-5.1c.3-.8 1-1.5 1.8-1.8C6.8 4.6 10.5 4.5 12 4.5s5.2.1 6.6.6c.8.3 1.5 1 1.8 1.8.4.9.6 2.9.6 5.1Z" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </>
  ),
  luma: (
    <>
      <path d="M12 2.8c.4 4.7 2.5 6.8 7.2 7.2-4.7.4-6.8 2.5-7.2 7.2-.4-4.7-2.5-6.8-7.2-7.2 4.7-.4 6.8-2.5 7.2-7.2Z" />
      <path d="M18.2 15.8c.2 2 1.1 2.9 3 3.1-1.9.2-2.8 1.1-3 3.1-.2-2-1.1-2.9-3-3.1 1.9-.2 2.8-1.1 3-3.1Z" />
    </>
  ),
}

export function SocialLink({
  label,
  href,
  icon,
  className,
  onClick,
}: {
  label: string
  href: string
  icon: SocialKind
  className?: string
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={className}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paths[icon]}
      </svg>
      <span>{label}</span>
    </a>
  )
}
