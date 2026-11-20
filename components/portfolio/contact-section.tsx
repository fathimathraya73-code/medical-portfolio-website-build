'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'

export function ContactSection() {
  const [status, setStatus] = useState('')

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const senderEmail = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${senderEmail}`)
    window.location.assign(`mailto:?subject=${subject}&body=${body}`)
    setStatus('Your email app is ready. Add the contact address “your email” to send this message.')
  }

  return (
    <section className="bg-[#263f37] py-20 text-[#f9f8f2] sm:py-24" id="contact">
      <div className="portfolio-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#bfd0c1]">Get in touch</p>
          <h2 className="mt-5 max-w-md font-[Manrope] text-4xl font-semibold leading-[1.13] tracking-[-0.045em] sm:text-5xl">A conversation starts with a hello.</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#d5dfd8]">For professional enquiries, collaborations, or a simple introduction.</p>
          <div className="mt-9 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#dce9df]">
              <Mail aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b8cbbd]">Email</p>
              <span className="mt-1 block text-sm font-medium">your email</span>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#b8cbbd]">Replace “your email” with the preferred contact address before publishing.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={prepareEmail}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-semibold text-[#e8eee8]">
              Your name
              <input autoComplete="name" className="h-12 rounded-xl border border-white/20 bg-white/[0.07] px-4 text-sm font-normal text-white placeholder:text-white/45" name="name" placeholder="How should I address you?" required />
            </label>
            <label className="flex flex-col gap-2 text-xs font-semibold text-[#e8eee8]">
              Your email
              <input autoComplete="email" className="h-12 rounded-xl border border-white/20 bg-white/[0.07] px-4 text-sm font-normal text-white placeholder:text-white/45" name="email" placeholder="you@example.com" required type="email" />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-xs font-semibold text-[#e8eee8]">
            Message
            <textarea className="min-h-[128px] resize-y rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-sm font-normal text-white placeholder:text-white/45" name="message" placeholder="Write a short note…" required />
          </label>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button className="inline-flex h-12 items-center gap-2 rounded-full bg-[#edf2e9] px-6 text-sm font-bold text-[#263f37] transition hover:bg-white" type="submit">
              Prepare email
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </button>
            <p aria-live="polite" className="max-w-xs text-xs leading-5 text-[#ccdad0]">{status}</p>
          </div>
        </form>
      </div>
      <div className="portfolio-shell mt-16 border-t border-white/15 pt-6 text-xs text-[#c7d4ca]">
        © {new Date().getFullYear()} Dr. Name · Medical portfolio
      </div>
    </section>
  )
}
