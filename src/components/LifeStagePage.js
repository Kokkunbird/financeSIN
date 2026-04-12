import Link from "next/link";

function PulseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Shared shell for life-stage landing pages.
 *
 * Props:
 *  eyebrow      — small label above headline (string)
 *  headline     — main H1 (string, may include JSX spans for accent)
 *  sub          — paragraph below headline (string)
 *  ctaLabel     — button text (string)
 *  ls           — life-stage slug passed to ?ls= (string)
 *  cards        — array of { icon, title, text } (max 3)
 *  checklist    — array of strings shown as bullet points under headline
 *  accentColor  — Tailwind color key: "indigo" | "violet" | "emerald" (default "indigo")
 */
export default function LifeStagePage({
  eyebrow,
  headline,
  sub,
  ctaLabel = "Check my financial health",
  ls,
  cards = [],
  checklist = [],
  accentColor = "indigo",
}) {
  const accent = {
    indigo: {
      pill: "border-indigo-100 bg-indigo-50 text-indigo-700",
      dot: "bg-indigo-400",
      btn: "bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_24px_rgba(99,102,241,0.35)]",
      icon: "bg-indigo-50 text-indigo-600",
      check: "text-indigo-500",
    },
    violet: {
      pill: "border-violet-100 bg-violet-50 text-violet-700",
      dot: "bg-violet-400",
      btn: "bg-violet-600 hover:bg-violet-700 shadow-[0_4px_24px_rgba(139,92,246,0.35)]",
      icon: "bg-violet-50 text-violet-600",
      check: "text-violet-500",
    },
    emerald: {
      pill: "border-emerald-100 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-400",
      btn: "bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_24px_rgba(16,185,129,0.35)]",
      icon: "bg-emerald-50 text-emerald-600",
      check: "text-emerald-500",
    },
  }[accentColor];

  const href = `/?ls=${ls}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_120%_50%_at_50%_0%,_rgba(99,102,241,0.08),_transparent_65%)]" />

      {/* Nav */}
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <PulseIcon />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">Financial Health Check</span>
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-500 backdrop-blur-sm sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
          Free · about 3 minutes
        </div>
      </nav>

      {/* Content */}
      <main className="relative mx-auto max-w-5xl px-5 pb-20 pt-6 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* Left */}
          <div className="space-y-8">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${accent.pill}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
              {eyebrow}
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-6xl">
                {headline}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-500">{sub}</p>
            </div>

            {checklist.length > 0 && (
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className={`mt-0.5 shrink-0 ${accent.check}`}><CheckIcon /></span>
                    <span className="text-sm leading-6 text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={href}
                className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold text-white transition active:scale-[0.98] ${accent.btn}`}
              >
                {ctaLabel}
                <ArrowRightIcon />
              </Link>
              <p className="text-sm text-slate-400">No account needed · results in under 3 minutes</p>
            </div>

            <p className="text-xs leading-5 text-slate-400">
              This tool provides general financial information only and does not constitute financial advice. Results are illustrative estimates based on Singapore national benchmarks.
            </p>
          </div>

          {/* Right: cards */}
          <div className="space-y-4 lg:pt-4">
            {cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition hover:border-slate-200 hover:bg-white hover:shadow-sm">
                {card.icon && (
                  <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${accent.icon}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {card.icon}
                    </svg>
                  </div>
                )}
                <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{card.text}</p>
              </div>
            ))}

            {/* Bottom CTA repeat for mobile */}
            <Link
              href={href}
              className={`mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-sm font-semibold text-white transition ${accent.btn} lg:hidden`}
            >
              {ctaLabel} <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
