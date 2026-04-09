"use client";

function toneClasses(tone) {
  if (tone === "rose") {
    return {
      badge: "border-rose-400/30 bg-rose-500/10 text-rose-200",
      accent: "bg-rose-500",
      cta: "bg-violet-100 text-violet-900 hover:bg-violet-200",
    };
  }

  if (tone === "emerald") {
    return {
      badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
      accent: "bg-emerald-500",
      cta: "bg-emerald-100 text-emerald-950 hover:bg-emerald-200",
    };
  }

  return {
    badge: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    accent: "bg-violet-500",
    cta: "bg-violet-100 text-violet-900 hover:bg-violet-200",
  };
}

export default function ResultsDashboard({ results, lead }) {
  const tone = toneClasses(results.tier.tone);
  const initials = lead.name ? lead.name.trim().charAt(0).toUpperCase() : "Y";
  const weakestLabel = results.weakestCategory.title.replace(" health", "");

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-[#252c37] p-4 shadow-[0_40px_100px_rgba(15,23,42,0.24)] sm:p-7">
        <div className="rounded-[1.75rem] border border-white/5 bg-[#171d26] p-4 sm:p-7">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/5 bg-[#111821] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-sm font-semibold text-white">
                M
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight text-white">SINGAPORE FINANCIAL DASHBOARD</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SFHI Results</p>
              </div>
            </div>
            <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${tone.badge}`}>
              {results.tier.label}
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
            <aside className="flex min-w-0 flex-col gap-4">
              <div className="rounded-[1.5rem] bg-[#202733] p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Dashboard</p>
                <div className="mt-6 space-y-4">
                  <NavPill label="SFHI Score" active />
                  <NavPill label="Benchmark" />
                  <NavPill label="Protection" />
                  <NavPill label="Planning" />
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-violet-900/50 p-5 text-white">
                <p className="text-lg font-semibold">What This Could Mean For You</p>
                <p className="mt-4 text-base leading-8 text-slate-200">
                  Without proper planning, these gaps may affect your ability to handle unexpected events or achieve long-term stability.
                </p>
              </div>
            </aside>

            <div className="min-w-0 space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <PanelCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Your SFHI score</p>
                  <div className="mt-5 flex items-center gap-5">
                    <div className={`grid h-20 w-20 place-items-center rounded-full ${tone.accent} text-3xl font-bold text-white`}>
                      {results.total}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Comparison</p>
                      <p className="text-base leading-7 text-slate-200">{results.comparisonText}</p>
                      <p className="text-sm text-slate-400">Singapore average ({results.benchmark})</p>
                    </div>
                  </div>
                </PanelCard>

                <PanelCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Reality trigger</p>
                  <p className="mt-5 text-base leading-8 text-slate-200">
                    Based on your responses...
                  </p>
                  <p className="mt-4 text-lg leading-9 text-white">
                    {results.weakestCategory.message} These gaps are common, but delaying action increases risk.
                  </p>
                </PanelCard>
              </div>

              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Key insights vs Singapore average</p>
                <div className="mt-6 space-y-5">
                  {results.categories.map((category) => (
                    <InsightRow key={category.key} category={category} tone={tone} />
                  ))}
                </div>
              </PanelCard>
            </div>

            <aside className="flex min-w-0 flex-col gap-4">
              <div className="rounded-[1.5rem] bg-[#202733] p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Participant</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-violet-600 text-base font-semibold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white">{lead.name || "Your Profile"}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">SFHI participant</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <StatBox label="Your score" value={results.total} />
                  <StatBox label="SG average" value={results.benchmark} />
                  <div className="col-span-2 rounded-2xl border border-white/6 bg-[#171d26] px-4 py-4 text-center">
                    <p className="text-base font-semibold text-white">{weakestLabel}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">Primary gap area</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-violet-900 p-5 text-white">
                <h3 className="text-base font-semibold">Get a personalised strategy to improve your financial position</h3>
                <p className="mt-3 text-sm leading-6 text-violet-200">
                  A specialist will review your results and build a tailored roadmap aligned with Singapore financial planning principles.
                </p>
                <button
                  type="button"
                  className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${tone.cta}`}
                >
                  Get My Personal Plan
                </button>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-violet-200">
                  No obligation · confidential
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500">
        This tool provides general financial information and does not constitute financial advice.
      </div>
    </section>
  );
}

function PanelCard({ children }) {
  return <div className="rounded-[1.5rem] bg-[#202733] p-5 text-white">{children}</div>;
}

function NavPill({ label, active = false }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${active ? "bg-violet-100/10 text-white" : "bg-white/5 text-slate-400"}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.24em]">{label}</span>
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-violet-500" : "bg-slate-600"}`} />
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#171d26] px-4 py-4 text-center">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
    </div>
  );
}

function InsightRow({ category, tone }) {
  const difference = category.userScore - category.benchmarkScore;
  const comparison =
    difference > 0
      ? `${difference} above SG average`
      : difference < 0
        ? `${Math.abs(difference)} below SG average`
        : "matching SG average";

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-semibold text-white">{category.title}</p>
          <p className="mt-1 text-sm text-slate-400">{comparison}</p>
        </div>
        <p className="text-sm text-slate-400">
          SG avg: {category.benchmarkScore} | <span className="font-semibold text-violet-300">You: {category.userScore}</span>
        </p>
      </div>

      <div className="h-2 rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${tone.accent}`} style={{ width: `${category.userScore}%` }} />
      </div>

      <p className="text-sm leading-7 text-slate-300">{category.message}</p>
    </div>
  );
}
