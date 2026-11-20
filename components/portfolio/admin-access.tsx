'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, LogIn, LogOut, X } from 'lucide-react'

type Props = { isAdmin: boolean }

export function AdminAccess({ isAdmin }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = await response.json()
      if (!response.ok) {
        setMessage(result.error ?? 'Could not sign in. Please try again.')
        return
      }

      setPassword('')
      setMessage('Editing is enabled.')
      router.refresh()
    } catch {
      setMessage('Could not sign in. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      await fetch('/api/admin/session', { method: 'DELETE' })
      setOpen(false)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label={isAdmin ? 'Portfolio editing options' : 'Open portfolio editor sign in'}
        className={`flex size-10 items-center justify-center rounded-full border transition ${isAdmin ? 'border-[#b9cec0] bg-[#e8efe8] text-primary' : 'border-border bg-card text-muted-foreground hover:text-primary'}`}
        onClick={() => {
          setOpen((current) => !current)
          setMessage('')
        }}
        type="button"
      >
        {isAdmin ? <KeyRound aria-hidden="true" className="size-4" /> : <LogIn aria-hidden="true" className="size-4" />}
      </button>

      {open && (
        <section aria-label="Portfolio editor" className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(320px,calc(100vw-32px))] rounded-2xl border border-border bg-card p-5 shadow-[0_20px_60px_rgba(30,53,45,0.14)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-[Manrope] text-sm font-bold text-foreground">{isAdmin ? 'Portfolio editor' : 'Editor access'}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isAdmin ? 'You can add or remove photos and evidence.' : 'Sign in to manage photos and competency evidence.'}
              </p>
            </div>
            <button aria-label="Close editor panel" className="rounded-full p-1 text-muted-foreground hover:bg-muted" onClick={() => setOpen(false)} type="button">
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          {isAdmin ? (
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted" disabled={busy} onClick={signOut} type="button">
              <LogOut aria-hidden="true" className="size-4" />
              {busy ? 'Signing out…' : 'Sign out'}
            </button>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={signIn}>
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-foreground" htmlFor="portfolio-admin-password">
                Portfolio password
                <input
                  autoComplete="current-password"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-normal"
                  id="portfolio-admin-password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>
              <button className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-[#274c40] disabled:cursor-wait disabled:opacity-60" disabled={busy} type="submit">
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}
          <p aria-live="polite" className={`mt-3 min-h-4 text-xs ${message.includes('enabled') ? 'text-primary' : 'text-muted-foreground'}`}>
            {message}
          </p>
        </section>
      )}
    </div>
  )
}
