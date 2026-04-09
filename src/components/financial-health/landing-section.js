export function LandingSection({ onStart }) {
  const benefitCards = [
    {
      title: "Stress-test your safety net",
      body: "See how prepared you may be for medical bills, income loss, and financial disruption.",
    },
    {
      title: "Spot hidden protection gaps",
      body: "Get a fast summary of where your current setup may leave you exposed.",
    },
    {
      title: "Receive a personalised next-step summary",
      body: "Understand what to review before a crisis forces difficult decisions.",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white px-6 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:px-10 sm:py-14">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_40%)]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Free financial resilience check
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Can You Survive 6 Months Without Income?
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A quick self-check to highlight how well your finances may hold up if illness, injury,
              or a sudden income stop changes everything.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Start Free Check
            </button>
            <p className="flex items-center text-sm text-slate-500">
              Takes about 2 minutes. No payment required.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Income loss</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                If work stops suddenly, even a few months can put serious pressure on bills and savings.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Hospital bills</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Medical events often create extra costs at the exact moment income becomes less certain.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Family impact</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Financial gaps can hit harder when people around you depend on your income.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Why people use this</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                A simple check before life gets expensive
              </h2>
            </div>

            <div className="space-y-4">
              {benefitCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>

            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300">
              This tool provides general financial information and does not constitute financial advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
