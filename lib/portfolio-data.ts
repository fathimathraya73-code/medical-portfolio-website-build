import { list } from '@vercel/blob'
import type { PortfolioSection } from '@/lib/competencies'

export type PortfolioFile = {
  pathname: string
  url: string
  uploadedAt: string
  size: number
  contentType: string
}

export function portfolioContentType(pathname: string) {
  const extension = pathname.slice(pathname.lastIndexOf('.')).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.webp') return 'image/webp'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.pdf') return 'application/pdf'
  return 'application/octet-stream'
}

export async function getPortfolioFiles(section: PortfolioSection): Promise<PortfolioFile[]> {
  try {
    const files: PortfolioFile[] = []
    let cursor: string | undefined

    do {
      const result = await list({
        prefix: `portfolio/${section}/`,
        limit: 1000,
        cursor,
      })

      files.push(
        ...result.blobs.map((blob) => ({
          pathname: blob.pathname,
          url: blob.url,
          uploadedAt: blob.uploadedAt.toISOString(),
          size: blob.size,
          contentType: portfolioContentType(blob.pathname),
        })),
      )
      cursor = result.hasMore ? result.cursor : undefined
    } while (cursor)

    return files.sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt))
  } catch (error) {
    console.error('Portfolio files could not be loaded:', error)
    return []
  }
}
