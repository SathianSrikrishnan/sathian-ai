import { NextRequest, NextResponse } from 'next/server'
import { ALLOWED_ORIGINS } from '@/lib/constants'

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  return NextResponse.json(
    {
      error: 'This legacy endpoint has been retired. Use /api/agent/message.',
    },
    { status: 410, headers: corsHeaders(origin) },
  )
}
