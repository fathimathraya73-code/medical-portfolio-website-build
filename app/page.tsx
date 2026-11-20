import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, HeartPulse, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/portfolio/site-header'
import { ProfilePhoto } from '@/components/portfolio/profile-photo'
import { ContactSection } from '@/components/portfolio/contact-section'
import { hasPortfolioAdminSession } from '@/lib/portfolio-auth'
import { getPortfolioFiles } from '@/lib/portfolio-data'

export const dynamic = 'force-dynamic'

const upcomingAreas = [
  { title: 'Research', number: '01', icon: BookOpen },
  { title: 'Clinical experience', number: '02', icon: HeartPulse },
  { title: 'Professional development', number: '03', icon: Sparkles },
]

export default async function HomePage() {
  const [isAdmin, profileFiles] = await Promise.all([
    hasPortfolioAdminSession(),
    getPortfolioFiles('profile'),
  ])
  const profilePhoto = profileFiles[0]?.url

  return (
    <main>
      <SiteHeader isAdmin={isAdmin} />

      <section className="hero-panel min-h-[635px]">
        <div aria-hidden="true" className="hero-orbit" />
        <div className="portfolio-shell relative grid min-h-[635px] items-center gap-10 py-16 lg:grid-cols-[1.14fr_0.86fr] lg:gap-8 lg:py-14">
          <div className="relative z-10 max-w-[640px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e3d8] bg-white/60 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#486b57]">
              <span className="pulse-mark size-1.5 rounded-full bg-[#71977c]" />
              Medical portfolio · UAE
            </div>
            <h1 className="mt-7 font-[Manrope] text-[clamp(3.1rem,7.4vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.075em] text-[#20352f]">
              Care, curiosity <span className="font-medium italic text-[#63856f]">&amp;</span> purpose.
            </h1>
            <p className="mt-6 max-w-[480px] text-base leading-8 text-[#68756d] sm:text-lg">
              Hello, I&apos;m <span className="font-semibold text-[#315c50]">Dr. Name</span> — a medical professional committed to thoughtful, evidence-informed care and continuous learning.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link className="group inline-flex h-14 items-center gap-4 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_12px_32px_rgba(49,92,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#274c40] sm:px-7" href="/competencies">
                Explore competencies
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#516b5b] transition hover:bg-white/60" href="#about">
                Get to know me
                <ArrowDown aria-hidden="true" className="size-3.5" />
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-[#879087]">
              <span className="h-px w-8 bg-[#a9b7aa]" />
              A portfolio in progress
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[390px] lg:translate-x-3">
            <div aria-hidden="true" className="absolute -left-3 top-[18%] size-16 rounded-full border border-white/80 bg-white/45 backdrop-blur-sm" />
            <div aria-hidden="true" className="absolute -right-1 bottom-[19%] size-9 rounded-full border border-[#b8cdbb] bg-[#dce9de]/75" />
            <ProfilePhoto isAdmin={isAdmin} photoUrl={profilePhoto} />
            <div className="mx-auto mt-6 max-w-[330px] border-t border-[#cdd8ce] pt-4 text-center">
              <p className="font-[Manrope] text-xl font-bold tracking-tight text-[#20352f]">Dr. Name</p>
              <p className="mt-1 text-xs text-[#758078]">Medicine · United Arab Emirates</p>
            </div>
          </div>
        </div>
        <a aria-label="Scroll to about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[#819084] transition hover:text-primary sm:block" href="#about">
          <ArrowDown aria-hidden="true" className="size-4" />
        </a>
      </section>

      <section className="portfolio-shell py-20 sm:py-28" id="about">
        <div className="grid gap-10 md:grid-cols-[0.65fr_1.35fr] md:gap-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#718674]">A little about me</p>
            <h2 className="mt-4 font-[Manrope] text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#20352f] sm:text-[2.65rem]">Learning, listening, and showing up.</h2>
          </div>
          <div className="max-w-[650px]">
            <p className="text-base leading-8 text-[#69756d]">
              Medicine is both a science and a relationship. This portfolio brings together my learning, clinical development, and evidence of growth across the UAE&apos;s national medical competencies.
            </p>
            <p className="mt-5 text-base leading-8 text-[#69756d]">
              I value compassionate care, curiosity, and collaboration — and the everyday work of becoming a better physician.
            </p>
            <Link className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3" href="/competencies">
              View the nine competencies <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e3e5dc] bg-[#f0f1eb] py-20 sm:py-24">
        <div className="portfolio-shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#718674]">More to come</p>
              <h2 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.045em] text-[#20352f] sm:text-4xl">A work in progress.</h2>
            </div>
            <span className="rounded-full border border-[#d5ded4] bg-white/55 px-3.5 py-2 text-[11px] font-semibold text-[#758078]">Coming soon</span>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {upcomingAreas.map(({ title, number, icon: Icon }) => (
              <article className="rounded-2xl border border-[#e0e4dc] bg-[#fbfbf7] p-6 sm:p-7" key={title}>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#edf2ec] text-[#66816e]"><Icon aria-hidden="true" className="size-[18px]" /></span>
                  <span className="font-[Manrope] text-xs font-semibold text-[#a0a89e]">{number}</span>
                </div>
                <h3 className="mt-7 font-[Manrope] text-lg font-semibold text-[#31443b]">{title}</h3>
                <p className="mt-2 text-sm text-[#8b938c]">Coming soon</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-shell py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-[28px] bg-[#deebe1] px-7 py-9 sm:px-12 sm:py-12">
          <div aria-hidden="true" className="absolute -right-14 -top-24 size-64 rounded-full border border-[#c1d7c7]" />
          <div aria-hidden="true" className="absolute -right-1 top-7 size-5 rounded-full bg-[#89a991]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5c7a64]">My learning framework</p>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="font-[Manrope] text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#263f35] sm:text-4xl">Nine competencies. One evolving practice.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#62756a]">Explore the EmiratesMEDs framework for UAE medical graduates, with space to build a portfolio of evidence over time.</p>
            </div>
            <Link className="group relative inline-flex h-13 shrink-0 items-center justify-center gap-5 rounded-full bg-[#315c50] px-6 text-sm font-bold text-white transition hover:bg-[#274c40]" href="/competencies">
              View all competencies
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  )
}
