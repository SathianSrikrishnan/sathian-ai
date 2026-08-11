'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  BITCOINBAY_ACCESS_COOKIE,
  BITCOINBAY_COOKIE_MAX_AGE_SECONDS,
  createAccessToken,
  matchesAccessCode,
  readAccessConfig,
} from '@/lib/bitcoinbay-access'

export async function unlockBitcoinBay(formData: FormData): Promise<never> {
  const config = readAccessConfig()
  if (!config) redirect('/bitcoinbay?error=unavailable')

  const suppliedCode = String(formData.get('code') ?? '').replace(/\s+/g, '')
  if (!matchesAccessCode(suppliedCode, config.accessCode)) {
    redirect('/bitcoinbay?error=invalid')
  }

  cookies().set({
    name: BITCOINBAY_ACCESS_COOKIE,
    value: createAccessToken(config.secret),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/bitcoinbay',
    maxAge: BITCOINBAY_COOKIE_MAX_AGE_SECONDS,
  })

  redirect('/bitcoinbay')
}
