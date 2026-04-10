"use client";

import { useState } from "react";

const N8N_WEBHOOK_URL = "https://khainelo.app.n8n.cloud/webhook/Meridian-Assestment-Lead";

async function sendLeadToN8n(payload) {
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const sent = navigator.sendBeacon(
      N8N_WEBHOOK_URL,
      new Blob([JSON.stringify(payload)], { type: "text/plain;charset=UTF-8" })
    );

    if (sent) return true;
  }

  await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return true;
}

function toneClasses(tone) {
  if (tone === "rose") return { badge: "border-rose-400/30 bg-rose-500/10 text-rose-200", accent: "bg-rose-500", cta: "bg-white text-rose-950 hover:bg-rose-50" };
  if (tone === "emerald") return { badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200", accent: "bg-emerald-500", cta: "bg-white text-emerald-950 hover:bg-emerald-50" };
  return { badge: "border-amber-400/30 bg-amber-500/10 text-amber-100", accent: "bg-amber-400", cta: "bg-white text-slate-950 hover:bg-slate-100" };
}

export default function ResultsDashboard({ results, lead }) {
  const [ctaState, setCtaState] = useState("idle");
  const tone = toneClasses(results.tier.tone);
  const initials = lead.name ? lead.name.trim().charAt(0).toUpperCase() : "Y";

  async function handlePersonalPlanClick() {
    if (ctaState === "sending" || ctaState === "sent") return;
    setCtaState("sending");
    try {
      await sendLeadToN8n({
        lead,
        result: results,
        source: "sfhs-dashboard",
        timestamp: new Date().toISOString(),
      });
      setCtaState("sent");
    } catch (error) {
      console.error("n8n webhook error:", error);
      setCtaState("idle");
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-[#111827] p-4 shadow-[0_40px_100px_rgba(15,23,42,0.28)] sm:p-7">
        <div className="rounded-[1.75rem] border border-white/5 bg-[#0f172a] p-4 sm:p-7">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/5 bg-[#111827] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-tight text-white">SINGAPORE FINANCIAL HEALTH SCORE</p>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Full report</p>
            </div>
            <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${tone.badge}`}>{results.tier.label}</div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <PanelCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Your grade</p>
                  <div className="mt-5 flex items-center gap-5">
                    <div className={`grid h-24 w-24 place-items-center rounded-full ${tone.accent} text-4xl font-bold text-white`}>{results.tier.grade}</div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Score</p>
                      <p className="mt-2 text-3xl font-semibold text-white">{results.total}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{results.comparisonText}</p>
                    </div>
                  </div>
                </PanelCard>

                <PanelCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Life stage</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{results.lifeStage}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-300">Based on your responses, the biggest gap currently appears to be <span className="font-semibold text-white">{results.weakestArea.title}</span>.</p>
                </PanelCard>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <BreakdownCard title="Needs work" items={results.needsWork} tone="rose" />
                <BreakdownCard title="Okay" items={results.okay} tone="amber" />
                <BreakdownCard title="Strong" items={results.strong} tone="emerald" />
              </div>

              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Section scores</p>
                <div className="mt-5 space-y-4">
                  {results.sections.map((section) => (
                    <div key={section.key} className="rounded-[1.25rem] border border-white/6 bg-white/5 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-white">{section.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{section.risk}</p>
                        </div>
                        <p className="text-sm text-slate-400">Peer avg: {section.benchmarkScore} | <span className="font-semibold text-sky-300">You: {section.userScore}</span></p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-700"><div className={`h-full rounded-full ${tone.accent}`} style={{ width: `${section.userScore}%` }} /></div>
                    </div>
                  ))}
                </div>
              </PanelCard>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.5rem] bg-[#172033] p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Participant</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-base font-semibold text-white">{initials}</div>
                  <div>
                    <p className="text-base font-semibold text-white">{lead.name || "Your profile"}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{results.ageLabel} · {results.lifeStage}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <StatBox label="Grade" value={results.tier.grade} />
                  <StatBox label="Score" value={results.total} />
                  <StatBox label="Peer avg" value={results.benchmark} />
                  <StatBox label="Weakest" value={results.weakestArea.title.split(" ")[0]} />
                </div>
              </div>

              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Top 3 risks</p>
                <div className="mt-4 space-y-3">{results.topRisks.map((risk) => <ListCard key={risk.title} title={risk.title} text={risk.text} />)}</div>
              </PanelCard>

              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Top 3 improvement actions</p>
                <div className="mt-4 space-y-3">{results.topActions.map((action) => <ListCard key={action.title} title={action.title} text={action.text} />)}</div>
              </PanelCard>

              <div className="rounded-[1.5rem] bg-sky-900/60 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">Hidden opportunity</p>
                <p className="mt-4 text-base leading-8 text-slate-100">{results.hiddenOpportunity}</p>
              </div>

              <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white">
                <h3 className="text-xl font-semibold">Get Your Personalised Plan</h3>
                <p className="mt-3 text-sm leading-6 text-sky-100">Speak with a licensed financial representative for a confidential discussion about the areas that may deserve attention.</p>
                <button type="button" onClick={handlePersonalPlanClick} disabled={ctaState === "sending" || ctaState === "sent"} className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${tone.cta}`}>{ctaState === "sending" ? "Sending..." : ctaState === "sent" ? "Request Sent" : "Get Your Personalised Plan"}</button>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-sky-100">No obligation · confidential</p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-center text-sm text-slate-500">
        <p>{results.disclaimer}</p>
        <p>Any follow-up discussion should consider your personal objectives, financial situation and needs.</p>
      </div>
    </section>
  );
}

function PanelCard({ children }) { return <div className="rounded-[1.5rem] bg-[#172033] p-5 text-white">{children}</div>; }
function StatBox({ value, label }) { return <div className="rounded-2xl border border-white/6 bg-[#111827] px-4 py-4 text-center"><p className="text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p></div>; }
function ListCard({ title, text }) { return <div className="rounded-2xl border border-white/6 bg-white/5 p-4"><p className="text-sm font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-300">{text}</p></div>; }
function BreakdownCard({ title, items, tone }) {
  const tones = { rose: "border-rose-500/30 bg-rose-500/10 text-rose-200", amber: "border-amber-400/30 bg-amber-500/10 text-amber-100", emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" };
  return <div className={`rounded-[1.5rem] border p-5 ${tones[tone]}`}><p className="text-sm font-semibold uppercase tracking-[0.22em]">{title}</p><div className="mt-4 space-y-2 text-sm leading-6">{items.length ? items.map((item) => <p key={item}>• {item}</p>) : <p>Nothing major here right now.</p>}</div></div>;
}
