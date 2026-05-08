const SAFE_AUTH_PATH_PREFIXES = ["/app", "/toothfairy"]

function isSafeAuthPath(pathname: string) {
  return SAFE_AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function defaultAuthRedirectPath(host: string) {
  const normalizedHost = host.toLowerCase()
  const isTfnDomain =
    normalizedHost === "toothfairy.network" ||
    normalizedHost === "www.toothfairy.network"

  return isTfnDomain ? "/app/draw" : "/toothfairy/app/draw"
}

export function safeAuthRedirectPath(
  value: string | null | undefined,
  fallback = "/toothfairy/app/draw",
) {
  const fallbackPath = isSafeAuthPath(fallback) ? fallback : "/toothfairy/app/draw"
  const candidate = value?.trim()

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallbackPath
  }

  try {
    const parsed = new URL(candidate, "https://toothfairy.local")
    if (parsed.origin !== "https://toothfairy.local") return fallbackPath
    if (parsed.pathname.startsWith("/api/")) return fallbackPath
    if (!isSafeAuthPath(parsed.pathname)) return fallbackPath

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallbackPath
  }
}

export function safeAuthRedirectUrl(
  value: string | null | undefined,
  origin: string,
  fallback = "/toothfairy/app/draw",
) {
  return new URL(safeAuthRedirectPath(value, fallback), origin)
}
