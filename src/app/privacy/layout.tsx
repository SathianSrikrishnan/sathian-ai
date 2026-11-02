import type { ReactNode } from 'react'
import '../secondary-surfaces.css'

// Preserve the complete original styles on this secondary surface.
export default function SecondarySurfaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
