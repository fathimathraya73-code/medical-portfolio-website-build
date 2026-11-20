'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import { FileText, ImagePlus, LoaderCircle, Trash2 } from 'lucide-react'
import type { PortfolioFile } from '@/lib/portfolio-data'

const formats = '.jpg,.jpeg,.png,.webp,.pdf'

function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type Props = {
  section: string
  files: PortfolioFile[]
  isAdmin: boolean
}

export function EvidenceManager({ section, files, isAdmin }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [deleting, setDeleting] = useState('')

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
    if (selectedFiles.length === 0) return
    if (selectedFiles.length > 10) {
      setStatus('Upload up to 10 files at a time.')
      event.target.value = ''
      return
    }

    setBusy(true)
    setStatus('')

    try {
      const results = await Promise.allSettled(
        selectedFiles.map((file) => {
          const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'evidence'
          const pathname = `portfolio/${section}/${crypto.randomUUID()}-${safeName}`
          return upload(pathname, file, {
            access: 'public',
            handleUploadUrl: `/api/portfolio/${section}`,
            multipart: file.size > 5 * 1024 * 1024,
          })
        }),
      )
      const added = results.filter((result) => result.status === 'fulfilled').length
      const failed = results.length - added
      if (added > 0) router.refresh()
      setStatus(
        failed === 0
          ? `${added} ${added === 1 ? 'file' : 'files'} added.`
          : added > 0
            ? `${added} added; ${failed} could not be uploaded.`
            : 'Upload failed. Check your connection and try again.',
      )
    } catch {
      setStatus('Upload failed. Check your connection and try again.')
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  async function removeFile(pathname: string) {
    if (!window.confirm('Remove this evidence from the portfolio?')) return
    setDeleting(pathname)
    setStatus('')
    try {
      const response = await fetch(`/api/portfolio/${section}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname }),
      })
      const result = await response.json()
      if (!response.ok) {
        setStatus(result.error ?? 'The evidence could not be removed.')
        return
      }
      setStatus('Evidence removed.')
      router.refresh()
    } catch {
      setStatus('The evidence could not be removed. Check your connection.')
    } finally {
      setDeleting('')
    }
  }

  return (
    <div className="mt-6 border-t border-[#e8e9e0] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-[Manrope] text-[11px] font-bold uppercase tracking-[0.16em] text-[#718076]">Evidence</p>
          <p className="mt-1 text-xs text-muted-foreground">{files.length ? `${files.length} ${files.length === 1 ? 'item' : 'items'}` : 'No evidence added yet'}</p>
        </div>
        {isAdmin && (
          <>
            <input accept={formats} className="sr-only" multiple onChange={uploadFiles} ref={inputRef} type="file" />
            <button
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#cddbd0] bg-[#f7faf7] px-3.5 text-xs font-semibold text-primary transition hover:bg-[#eaf2ec] disabled:opacity-60"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {busy ? <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-3.5" />}
              {busy ? 'Uploading…' : 'Add evidence'}
            </button>
          </>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5">
          {files.map((file) => {
            const fileName = file.pathname.split('/').pop()?.replace(/^[0-9a-f-]{36}-/, '') ?? 'Evidence file'
            return (
              <li className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f7f8f3] px-3 py-2.5" key={file.pathname}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#688675]">
                  <FileText aria-hidden="true" className="size-4" />
                </span>
                <a className="min-w-0 flex-1" href={file.url} rel="noreferrer" target="_blank">
                  <span className="block truncate text-xs font-semibold text-foreground">{fileName}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{fileSize(file.size)} · {new Date(file.uploadedAt).toLocaleDateString()}</span>
                </a>
                {isAdmin && (
                  <button
                    aria-label={`Remove ${fileName}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-[#f2e7e4] hover:text-[#9a4d43] disabled:opacity-50"
                    disabled={deleting === file.pathname}
                    onClick={() => removeFile(file.pathname)}
                    type="button"
                  >
                    {deleting === file.pathname ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Trash2 aria-hidden="true" className="size-4" />}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {isAdmin && <p className="mt-3 text-[11px] leading-5 text-[#879087]">JPG, PNG, WebP or PDF · up to 12 MB per file · visible to everyone</p>}
      <p aria-live="polite" className="mt-2 min-h-4 text-xs text-primary">{status}</p>
    </div>
  )
}
