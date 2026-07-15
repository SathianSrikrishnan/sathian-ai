const TOOTH_FAIRY_HOSTS = new Set([
  'toothfairy.network',
  'www.toothfairy.network',
  'toothfairy.sathian.ai',
])

export function isToothFairyHost(hostValue: string | null | undefined): boolean {
  const host = (hostValue ?? '').trim().toLowerCase().split(':')[0]
  return TOOTH_FAIRY_HOSTS.has(host)
}
