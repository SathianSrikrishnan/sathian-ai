import { NextRequest, NextResponse } from 'next/server'
import { signStudioToken } from '@/lib/studio-token'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const expected = process.env.STUDIO_PASSWORD

  if (!expected) {
    return NextResponse.json({ error: 'Studio not configured' }, { status: 500 })
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const token = await signStudioToken(expected)
  const response = NextResponse.json({ ok: true })
  response.cookies.set('studio_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('studio_auth')
  return response
}
