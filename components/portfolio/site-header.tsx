import Link from 'next/link'
import { ArrowUpRight, Stethoscope } from 'lucide-react'
import { AdminAccess } from '@/components/portfolio/admin-access'

export function SiteHeader({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="portfolio-shell flex h-[76px] items-center justify-between gap-2 sm:gap-5">
        <Link aria-label="Dr. Name home" className="flex items-center gap-3" href="/">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Stethoscope aria-hidden="true" className="size-[18px]" strokeWidth={1.7} />
          </span>
          <span className="shrink-0 whitespace-nowrap font-[Manrope] text-sm font-bold tracking-tight text-foreground">Dr. Name</span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-8">
          <Link className="text-sm text-muted-foreground transition hover:text-primary" href="/">
            About
          </Link>
          <Link className="flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-[#203f35]" href="/competencies">
            Competencies
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
          <AdminAccess isAdmin={isAdmin} />
        </nav>
      </div>
    </header>
  )
}
