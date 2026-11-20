import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  adminSessionDurationSeconds,
  createAdminSessionToken,
  hasAdminRequestSession,
  isSameOriginRequest,
  verifyAdminPassword,
} from '@/lib/portfolio-auth'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: hasAdminRequestSession(request) }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin not allowed.' }, { status: 403 })
  }

  let password: unknown
  try {
    const body = await request.json()
    password = body?.password
  } catch {
    return NextResponse.json({ error: 'Enter your portfolio password.' }, { status: 400 })
  }

  if (typeof password !== 'string' || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'That password did not match.' }, { status: 401 })
  }

  const token = createAdminSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Portfolio editing is not configured.' }, { status: 503 })
  }

  const response = NextResponse.json({ authenticated: true })
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: adminSessionDurationSeconds,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin not allowed.' }, { status: 403 })
  }

  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
