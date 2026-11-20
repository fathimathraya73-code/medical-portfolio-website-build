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
              {competency.id !== 'collaborator-innovator-and-leader' && (
                <div className="mt-auto">
                  <EvidenceManager files={evidenceByCompetency[index]} isAdmin={isAdmin} section={competency.id} />
                </div>
              )}
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-7 rounded-[24px] border border-[#e4e6de] bg-[#fffefa] p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr]" aria-labelledby="world-anatomy-day-reflection">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#778579]">Collaborator · Innovator · Leader</p>
            <h2 id="world-anatomy-day-reflection" className="mt-3 font-[Manrope] text-2xl font-semibold tracking-[-0.04em] text-[#273d33] sm:text-3xl">My Reflection</h2>
            <h3 className="mt-3 text-sm font-bold leading-6 text-[#496454]">Reflection on Organizing a Plank Competition Stall During World Anatomy Day</h3>
            <div className="mt-6 space-y-5 text-sm leading-7 text-[#69756d]">
              <div><h4 className="font-[Manrope] text-xs font-bold uppercase tracking-[0.12em] text-[#315c50]">1. Description</h4><p className="mt-1">My team and I organized the plank competition stall for World Anatomy Day. We shared responsibilities, arranged the stall, and invited people of different age groups to participate.</p></div>
              <div><h4 className="font-[Manrope] text-xs font-bold uppercase tracking-[0.12em] text-[#315c50]">2. Feelings</h4><p className="mt-1">At first, I was quite nervous because I had never organized a stall before. I was not sure how things would turn out or whether people would be interested. However, as more people started coming to our stall and participating, I became more comfortable and confident. Seeing everyone enjoy the activity made me feel happy and proud of what we had organized together.</p></div>
              <div><h4 className="font-[Manrope] text-xs font-bold uppercase tracking-[0.12em] text-[#315c50]">3. Evaluation</h4><p className="mt-1">One of the best parts was how well we worked together as a team. Everyone contributed in their own way, and we managed to make the competition enjoyable. However, there were moments when managing the stall and encouraging people to participate felt a little challenging, especially since it was our first experience.</p></div>
              <div><h4 className="font-[Manrope] text-xs font-bold uppercase tracking-[0.12em] text-[#315c50]">4. Analysis</h4><p className="mt-1">This experience taught me that organizing an event requires more than just coming up with an idea. It takes teamwork, communication, planning, and cooperation. I also realized that even a simple activity like a plank competition can make learning about anatomy more interesting by showing how different muscles work together.</p></div>
              <div><h4 className="font-[Manrope] text-xs font-bold uppercase tracking-[0.12em] text-[#315c50]">5. Conclusion</h4><p className="mt-1">Overall, this was a really memorable experience for me as a first-year university student. It gave me a chance to try something new, interact with different people, and come out of my comfort zone. I realized that I am capable of taking responsibility and contributing to something meaningful.</p></div>
              <div><h4 className="font-[Manrope] text-xs font-bold uppercase tracking-[0.12em] text-[#315c50]">6. Action Plan</h4><p className="mt-1">If I get another opportunity to organize a stall, I would like to be more involved in the planning from the beginning. I would also try to come up with more creative ideas and improve the way I communicate with participants. Most importantly, I would like to take part in more university activities and gain confidence through new experiences.</p></div>
            </div>
          </div>
          <div className="lg:border-l lg:border-[#e8e9e0] lg:pl-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#778579]">World Anatomy Day · Supporting materials</p>
            <h3 className="mt-3 font-[Manrope] text-xl font-semibold tracking-[-0.035em] text-[#273d33]">Evidence</h3>
            <p className="mt-2 text-sm leading-6 text-[#788078]">Add the Certificate of Appreciation and the two photographs documenting the plank competition and leaderboard planning.</p>
            <EvidenceManager files={evidenceByCompetency[4]} isAdmin={isAdmin} section="collaborator-innovator-and-leader" />
            <div className="mt-7 border-t border-[#e8e9e0] pt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#718076]">Competencies demonstrated</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#edf2ec] px-3 py-2 text-xs font-semibold text-[#496b55]">Collaboration</span>
                <span className="rounded-full bg-[#edf2ec] px-3 py-2 text-xs font-semibold text-[#496b55]">Leadership</span>
                <span className="rounded-full bg-[#edf2ec] px-3 py-2 text-xs font-semibold text-[#496b55]">Innovation</span>
              </div>
            </div>
          </div>
        </section>

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
