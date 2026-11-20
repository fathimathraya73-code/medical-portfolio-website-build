'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import { ImagePlus, LoaderCircle, UserRound } from 'lucide-react'

export function ProfilePhoto({ photoUrl, isAdmin }: { photoUrl?: string; isAdmin: boolean }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setBusy(true)
    setMessage('')
    try {
      const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'portrait'
      const pathname = `portfolio/profile/${crypto.randomUUID()}-${safeName}`
      await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/portfolio/profile',
      })
      setMessage('Portrait added.')
      router.refresh()
    } catch {
      setMessage('The photo could not be uploaded. Check your connection and try again.')
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      <div className="portrait-frame relative aspect-[0.84] overflow-hidden rounded-[44%_44%_30%_30%] border-[9px] border-white/70 shadow-[0_22px_65px_rgba(40,68,55,0.12)]">
        {photoUrl ? (
          <img alt="Portrait of Dr. Name" className="absolute inset-0 size-full object-cover" src={photoUrl} />
        ) : (
          <div aria-label="Portrait photo placeholder" className="absolute inset-0 flex flex-col items-center justify-center text-[#668272]">
            <div className="pulse-mark mb-4 flex size-[76px] items-center justify-center rounded-full border border-white/70 bg-white/50">
              <UserRound aria-hidden="true" className="size-9" strokeWidth={1.2} />
            </div>
            <span className="font-[Manrope] text-xs font-semibold tracking-wide">Portrait photo</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={uploadPhoto} ref={inputRef} type="file" />
          <button
            className="absolute bottom-4 right-1 inline-flex h-10 items-center gap-2 rounded-full border border-white bg-card px-4 text-xs font-semibold text-primary shadow-[0_8px_24px_rgba(34,55,44,0.12)] transition hover:bg-[#eff5ef] disabled:opacity-60"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {busy ? <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-3.5" />}
            {busy ? 'Uploading…' : photoUrl ? 'Change photo' : 'Add photo'}
          </button>
          <p aria-live="polite" className="mt-3 text-center text-xs text-primary">{message}</p>
        </>
      )}
    </div>
  )
}
