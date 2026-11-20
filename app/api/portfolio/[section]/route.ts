import { del, list } from '@vercel/blob'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isPortfolioSection } from '@/lib/competencies'
import { hasAdminRequestSession, isSameOriginRequest } from '@/lib/portfolio-auth'
import { portfolioContentType } from '@/lib/portfolio-data'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 12 * 1024 * 1024
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const imageTypes = ['image/jpeg', 'image/png', 'image/webp']
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf'])

type RouteContext = { params: Promise<{ section: string }> }

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function requireAdmin(request: Request) {
  if (!isSameOriginRequest(request)) return jsonError('Request origin not allowed.', 403)
  if (!hasAdminRequestSession(request)) return jsonError('Sign in to manage this portfolio.', 401)
  return null
}

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params
  if (!isPortfolioSection(section)) return jsonError('This portfolio section does not exist.', 404)

  try {
    const { blobs } = await list({ prefix: `portfolio/${section}/`, limit: 1000 })
    return NextResponse.json(
      {
        files: blobs.map((blob) => ({
          pathname: blob.pathname,
          url: blob.url,
          uploadedAt: blob.uploadedAt.toISOString(),
          size: blob.size,
          contentType: portfolioContentType(blob.pathname),
        })),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return jsonError('Evidence could not be loaded. Check that the Blob store is connected.', 503)
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const { section } = await context.params
  if (!isPortfolioSection(section)) return jsonError('This portfolio section does not exist.', 404)

  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return jsonError('Choose a file and try again.', 400)
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const prefix = `portfolio/${section}/`
        const filename = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : ''
        const extension = filename.slice(filename.lastIndexOf('.')).toLowerCase()
        const imageOnlyExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])
        if (!filename || filename.includes('/') || filename.includes('\\') || !allowedExtensions.has(extension)) {
          throw new Error('Use JPG, PNG, WebP, or PDF files only.')
        }
        if (section === 'profile' && !imageOnlyExtensions.has(extension)) {
          throw new Error('Choose an image for the profile portrait.')
        }

        return {
          allowedContentTypes: section === 'profile' ? imageTypes : allowedTypes,
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: false,
          validUntil: Date.now() + 5 * 60 * 1000,
        }
      },
    })
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Upload could not be authorized.', 400)
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const { section } = await context.params
  if (!isPortfolioSection(section)) return jsonError('This portfolio section does not exist.', 404)

  let pathname: unknown
  try {
    pathname = (await request.json())?.pathname
  } catch {
    return jsonError('Choose an evidence file to remove.', 400)
  }

  const prefix = `portfolio/${section}/`
  if (typeof pathname !== 'string' || !pathname.startsWith(prefix)) {
    return jsonError('This file does not belong to the selected section.', 400)
  }

  try {
    const { blobs } = await list({ prefix, limit: 1000 })
    const selectedFile = blobs.find((blob) => blob.pathname === pathname)
    if (!selectedFile) return jsonError('That file was not found.', 404)

    await del(selectedFile.url)
    return NextResponse.json({ deleted: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return jsonError('The evidence could not be removed. Please try again.', 503)
  }
}
