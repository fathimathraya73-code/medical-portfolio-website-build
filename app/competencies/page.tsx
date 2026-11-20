import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Layers3 } from 'lucide-react'
import { ContactSection } from '@/components/portfolio/contact-section'
import { EvidenceManager } from '@/components/portfolio/evidence-manager'
import { SiteHeader } from '@/components/portfolio/site-header'
import { competencies } from '@/lib/competencies'
import { hasPortfolioAdminSession } from '@/lib/portfolio-auth'
import { getPortfolioFiles } from '@/lib/portfolio-data'

export const dynamic = 'force-dynamic'

export default async function CompetenciesPage() {
  const [isAdmin, evidenceByCompetency] = await Promise.all([
    hasPortfolioAdminSession(),
    Promise.all(competencies.map((competency) => getPortfolioFiles(competency.id))),
  ])
  const fileCounts = evidenceByCompetency.map((files) => files.length)
  const totalEvidence = fileCounts.reduce((total, count) => total + count, 0)

  return (
    <main>
      <SiteHeader isAdmin={isAdmin} />

      <section className="hero-panel overflow-hidden">
        <div aria-hidden="true" className="hero-orbit" />
        <div className="portfolio-shell relative py-16 sm:py-20">
          <Link className="inline-flex items-center gap-2 text-xs font-semibold text-[#6a7c70] transition hover:text-primary" href="/">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to portfolio
          </Link>
          <div className="mt-9 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-[700px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#66816e]">EmiratesMEDs · United Arab Emirates</p>
              <h1 className="mt-5 font-[Manrope] text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.065em] text-[#20352f]">Competencies in practice.</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#69756d]">Nine roles that shape the knowledge, care, and professional growth expected of UAE medical graduates.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/55 px-4 py-3 backdrop-blur-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#e6eee7] text-primary"><Layers3 aria-hidden="true" className="size-[18px]" /></span>
              <div><p className="font-[Manrope] text-sm font-bold text-[#354b3d]">09 competencies</p><p className="mt-0.5 text-xs text-[#7e887f]">{totalEvidence} evidence {totalEvidence === 1 ? 'item' : 'items'}</p></div>
            </div>
          </div>
          <a className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#65816e] transition hover:text-primary" href="#competency-list">
            Explore the framework <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="portfolio-shell py-14 sm:py-20" id="competency-list">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#778579]">Professional development</p><h2 className="mt-3 font-[Manrope] text-2xl font-semibold tracking-[-0.035em] text-[#273d33] sm:text-3xl">The nine competencies</h2></div>
          <p className="max-w-md text-xs leading-6 text-[#7b847d]">Add evidence to any section while signed in. Uploaded items are public and should not contain identifiable patient information.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {competencies.map((competency, index) => (
            <article className="competency-card flex h-full flex-col rounded-[22px] border border-[#e4e6de] bg-[#fffefa] p-5 sm:p-6" key={competency.id}>
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#edf2ec] font-[Manrope] text-xs font-bold text-[#63816d]">{String(index + 1).padStart(2, '0')}</span>
                <div className="pt-0.5">
                  <h3 className="font-[Manrope] text-[17px] font-bold leading-snug tracking-[-0.02em] text-[#2b4036]">{competency.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#788078]">{competency.description}</p>
                </div>
              </div>
              <div className="mt-auto">
                <EvidenceManager files={evidenceByCompetency[index]} isAdmin={isAdmin} section={competency.id} />
              </div>
            </article>
          ))}
        </div>

        <aside className="mt-9 flex flex-col gap-4 rounded-2xl border border-[#e3e5dc] bg-[#f0f1eb] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div><p className="font-[Manrope] text-sm font-bold text-[#34493d]">Research, publications, and experience</p><p className="mt-1 text-xs text-[#818980]">Coming soon</p></div>
          <Link className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition hover:gap-2.5" href="/#contact">Get in touch <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link>
        </aside>

        <p className="mt-7 text-[11px] leading-5 text-[#90978f]">Framework summary based on <a className="underline decoration-[#bfc8bf] underline-offset-2 hover:text-primary" href="https://doi.org/10.3389/fmed.2026.1803817" rel="noreferrer" target="_blank">EmiratesMEDs: a national competency framework for UAE medical graduates, Frontiers in Medicine (2026)</a>.</p>
      </section>

      <ContactSection />
    </main>
  )
}
