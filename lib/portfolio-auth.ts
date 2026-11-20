import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'portfolio_admin_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 8

function safeEqual(first: string, second: string) {
  const firstHash = createHash('sha256').update(first).digest()
  const secondHash = createHash('sha256').update(second).digest()
  return timingSafeEqual(firstHash, secondHash)
}

function signTimestamp(timestamp: string, password: string) {
  return createHmac('sha256', password).update(timestamp).digest('hex')
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export function verifyAdminPassword(candidate: string) {
  const configuredPassword = process.env.PORTFOLIO_ADMIN_PASSWORD
  if (!configuredPassword || !candidate || candidate.length > 256) return false
  return safeEqual(candidate, configuredPassword)
}

export function createAdminSessionToken() {
  const password = process.env.PORTFOLIO_ADMIN_PASSWORD
  if (!password) return null

  const timestamp = String(Date.now())
  return `${timestamp}.${signTimestamp(timestamp, password)}`
}

export function verifyAdminSessionToken(token: string | undefined) {
  const password = process.env.PORTFOLIO_ADMIN_PASSWORD
  if (!password || !token) return false

  const separator = token.indexOf('.')
  if (separator < 1) return false

  const timestamp = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  const issuedAt = Number(timestamp)
  if (!Number.isFinite(issuedAt)) return false

  const ageInSeconds = (Date.now() - issuedAt) / 1000
  if (ageInSeconds < 0 || ageInSeconds > SESSION_DURATION_SECONDS) return false

  return safeEqual(signature, signTimestamp(timestamp, password))
}

export async function hasPortfolioAdminSession() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export function hasAdminRequestSession(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const sessionCookie = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ADMIN_COOKIE_NAME}=`))

  return verifyAdminSessionToken(sessionCookie?.slice(ADMIN_COOKIE_NAME.length + 1))
}

export const adminSessionDurationSeconds = SESSION_DURATION_SECONDS
