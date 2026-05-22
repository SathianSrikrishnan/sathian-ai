import Link from "next/link"
import { toothlightRoutes } from "./toothlight-data"
import styles from "./toothlight-header.module.css"

type ToothlightHeaderProps = {
  active?: string
  variant?: "overlay" | "solid"
}

export function ToothlightHeader({
  active = "Home",
  variant = "overlay",
}: ToothlightHeaderProps) {
  return (
    <header className={[styles.header, styles[variant]].join(" ")}>
      <Link href="/toothlight" className={styles.brand} aria-label="Toothlight home">
        <span aria-hidden>T</span>
        Toothlight
      </Link>
      <nav className={styles.nav} aria-label="Toothlight sections">
        {toothlightRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            aria-current={route.label === active ? "page" : undefined}
          >
            {route.label}
          </Link>
        ))}
        <Link href="/toothfairy">Main site</Link>
      </nav>
    </header>
  )
}
