"use client";

import { useState } from "react";
import { SECTION_ICON } from "@/components/MoneyIcons";

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
  if (tone === "rose") return {
    badge: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    accent: "bg-rose-500",
    bar: "bg-rose-400",
    cta: "bg-white text-rose-950 hover:bg-rose-50",
    glow: "from-rose-600 to-rose-800",
  };
  if (tone === "emerald") return {
    badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    accent: "bg-emerald-500",
    bar: "bg-emerald-400",
    cta: "bg-white text-emerald-950 hover:bg-emerald-50",
    glow: "from-emerald-600 to-teal-700",
  };
  return {
    badge: "border-amber-400/30 bg-amber-500/10 text-amber-100",
    accent: "bg-amber-400",
    bar: "bg-amber-400",
    cta: "bg-white text-slate-950 hover:bg-slate-100",
    glow: "from-amber-500 to-orange-600",
  };
}

function urgencyColor(urgency) {
  if (urgency === "high") return "border-rose-500/40 bg-rose-500/10";
  if (urgency === "medium") return "border-amber-400/40 bg-amber-400/10";
  return "border-sky-400/30 bg-sky-400/10";
}

function urgencyLabel(urgency) {
  if (urgency === "high") return { text: "Priority", cls: "text-rose-300" };
  if (urgency === "medium") return { text: "Attention needed", cls: "text-amber-300" };
  return { text: "Review", cls: "text-sky-300" };
}

function buildShareText(results, lead) {
  const name = lead.name ? lead.name.split(" ")[0] : null;
  const greeting = name ? `${name} just` : "I just";
  return `${greeting} checked my Singapore Financial Health Score and got Grade ${results.tier.grade} (${results.total}/100).\n\nTop gap: ${results.weakestArea.title}.\nStrongest: ${results.strongestArea.title}.\n\nSee how you compare — free, takes 3 minutes:\n${typeof window !== "undefined" ? window.location.origin : ""}`;
}

export default function ResultsDashboard({ results, lead }) {
  const [ctaState, setCtaState] = useState("idle");
  const [expandedSection, setExpandedSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const tone = toneClasses(results.tier.tone);
  const initials = lead.name ? lead.name.trim().charAt(0).toUpperCase() : "Y";
  const shareText = buildShareText(results, lead);
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

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
    <section className="space-y-6">

      {/* ── Main dashboard card ── */}
      <div className="rounded-[2rem] bg-[#111827] p-4 shadow-[0_40px_100px_rgba(15,23,42,0.28)] sm:p-7">
        <div className="rounded-[1.75rem] border border-white/5 bg-[#0f172a] p-4 sm:p-7">

          {/* ── Header bar ── */}
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/5 bg-[#111827] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-tight text-white">SINGAPORE FINANCIAL HEALTH SCORE</p>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Meridian Advisory · 2026 assessment</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${tone.badge}`}>
                {results.tier.label}
              </div>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
                MAS-aware tool
              </div>
            </div>
          </div>

          {/* ── Singapore context banner ── */}
          <div className="mt-4 rounded-[1.5rem] border border-sky-500/20 bg-sky-900/20 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Singapore context</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{results.sgContext}</p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">

            {/* ══ LEFT COLUMN ══ */}
            <div className="space-y-4">

              {/* Score + life stage row */}
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <PanelCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Your score</p>
                  <div className="mt-5 flex items-center gap-5">
                    <div className={`relative grid h-24 w-24 shrink-0 place-items-center rounded-full ${tone.accent} text-4xl font-bold text-white shadow-lg`}>
                      {results.tier.grade}
                      <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[#172033] text-xs font-semibold text-slate-300 ring-2 ring-[#0f172a]">
                        {results.total}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Overall</p>
                      <p className="mt-1 text-3xl font-semibold text-white">{results.total}<span className="text-base text-slate-500">/100</span></p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{results.comparisonText}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-slate-700">
                    <div className={`h-full rounded-full ${tone.bar} transition-all duration-700`} style={{ width: `${results.total}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Peer benchmark: {results.benchmark} · Your score: {results.total}</p>
                </PanelCard>

                <PanelCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Life stage</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{results.lifeStage}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Based on your responses, the biggest gap currently appears to be{" "}
                    <span className="font-semibold text-white">{results.weakestArea.title}</span>.
                  </p>
                  <div className="mt-4 rounded-2xl border border-white/6 bg-white/5 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Strongest area</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-300">{results.strongestArea.title}</p>
                  </div>
                </PanelCard>
              </div>

              {/* Needs work / Okay / Strong */}
              <div className="grid gap-4 md:grid-cols-3">
                <BreakdownCard title="Needs work" items={results.needsWork} tone="rose" />
                <BreakdownCard title="Okay" items={results.okay} tone="amber" />
                <BreakdownCard title="Strong" items={results.strong} tone="emerald" />
              </div>

              {/* Section scores — expandable with why-score */}
              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Section scores</p>
                <p className="mt-1 text-xs text-slate-500">Tap any section to see what is driving your score</p>
                <div className="mt-5 space-y-3">
                  {results.sections.map((section) => {
                    const isOpen = expandedSection === section.key;
                    return (
                      <div key={section.key} className="rounded-[1.25rem] border border-white/6 bg-white/5 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedSection(isOpen ? null : section.key)}
                          className="w-full px-4 pt-4 pb-3 text-left"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-start gap-3">
                              {SECTION_ICON[section.key] && (
                                <span className="mt-0.5 shrink-0">{SECTION_ICON[section.key]}</span>
                              )}
                              <div>
                                <p className="text-base font-semibold text-white">{section.title}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{section.risk}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-slate-400 whitespace-nowrap">
                                Peer avg: {section.benchmarkScore} · <span className="font-semibold text-sky-300">You: {section.userScore}</span>
                              </p>
                              <ChevronIcon open={isOpen} />
                            </div>
                          </div>
                          <div className="mt-3 h-1.5 rounded-full bg-slate-700">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${section.userScore >= section.benchmarkScore ? "bg-emerald-400" : "bg-amber-400"}`}
                              style={{ width: `${section.userScore}%` }}
                            />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-white/6 px-4 pb-4 pt-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400 mb-2">Why this score?</p>
                            <p className="text-sm leading-7 text-slate-300">{section.whyThisScore}</p>
                            <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Recommended action</p>
                              <p className="mt-1 text-sm text-slate-200">{section.action}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </PanelCard>

              {/* What happens if nothing changes */}
              <div className="rounded-[1.5rem] border border-rose-500/20 bg-[#1a0f0f] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-300">What happens if nothing changes</p>
                <div className="mt-4 space-y-4">
                  <UrgencyBlock
                    label="Retirement shortfall"
                    text={results.urgencyNarrative.retirement}
                  />
                  <UrgencyBlock
                    label="Protection exposure"
                    text={results.urgencyNarrative.protection}
                  />
                  <UrgencyBlock
                    label="Inflation erosion"
                    text={results.urgencyNarrative.inflation}
                  />
                </div>
                <p className="mt-4 text-xs text-rose-400/60">Projections based on Singapore DOS cost of living data, CPF Board retirement sum statistics, and LIA 2022 protection gap research. These are illustrative estimates, not personalised advice.</p>
              </div>

            </div>
            {/* ══ END LEFT COLUMN ══ */}

            {/* ══ RIGHT SIDEBAR ══ */}
            <aside className="space-y-4">

              {/* Participant profile */}
              <div className="rounded-[1.5rem] bg-[#172033] p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Participant</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-base font-semibold text-white">
                    {initials}
                  </div>
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

              {/* Share your score */}
              <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Share your score</p>
                <p className="mt-1.5 text-sm text-slate-400">Challenge a friend to beat your grade.</p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
                >
                  <WhatsAppIcon />
                  Share on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                >
                  {copied ? "Copied!" : "Copy share message"}
                </button>
              </div>

              {/* Gap summary */}
              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Your top financial gaps</p>
                <p className="mt-1 text-xs text-slate-500">Based on Singapore benchmarks</p>
                <div className="mt-4 space-y-3">
                  {results.gapSummary.map((gap) => {
                    const u = urgencyLabel(gap.urgency);
                    return (
                      <div key={gap.title} className={`rounded-2xl border p-4 ${urgencyColor(gap.urgency)}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-white">{gap.title}</p>
                          <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] ${u.cls}`}>{u.text}</span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-300">{gap.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </PanelCard>

              {/* Top 3 risks */}
              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Key risk areas</p>
                <div className="mt-4 space-y-3">
                  {results.topRisks.map((risk) => (
                    <ListCard key={risk.title} title={risk.title} text={risk.text} />
                  ))}
                </div>
              </PanelCard>

              {/* Hidden opportunity */}
              <div className="rounded-[1.5rem] bg-sky-900/60 p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">Hidden opportunity</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{results.hiddenOpportunity}</p>
              </div>

              {/* CTA block */}
              <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-600 to-indigo-700 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Personalised financial plan</p>
                <h3 className="mt-3 text-xl font-semibold leading-7">
                  Improve your score to 85+ with a structured plan
                </h3>
                <p className="mt-3 text-sm leading-6 text-sky-100">
                  Speak with a licensed financial representative for a confidential, no-obligation review. Structured planning typically improves scores by 15–25 points.
                </p>
                <button
                  type="button"
                  onClick={handlePersonalPlanClick}
                  disabled={ctaState === "sending" || ctaState === "sent"}
                  className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${tone.cta} disabled:opacity-60`}
                >
                  {ctaState === "sending" ? "Sending…" : ctaState === "sent" ? "Request received — we will be in touch" : "Get My Personalised Plan"}
                </button>
                {ctaState === "sent" && (
                  <p className="mt-3 text-center text-xs text-sky-200">
                    A licensed representative will contact you via WhatsApp within 1 business day.
                  </p>
                )}
                <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-sky-200/70">
                  No obligation · confidential · MAS-regulated
                </p>
              </div>

              {/* Top improvement actions */}
              <PanelCard>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Top 3 improvement actions</p>
                <div className="mt-4 space-y-3">
                  {results.topActions.map((action) => (
                    <ListCard key={action.title} title={action.title} text={action.text} />
                  ))}
                </div>
              </PanelCard>

            </aside>
            {/* ══ END RIGHT SIDEBAR ══ */}
          </div>
        </div>
      </div>

      {/* ── Trust & data sources footer ── */}
      <div className="rounded-[1.5rem] border border-slate-200/60 bg-white px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Built using Singapore benchmarks</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              CPF Board retirement sum data · LIA Protection Gap Study 2022 · Department of Statistics Singapore (Household Expenditure Survey 2022/23) · MAS Financial Stability Review · DBS Financial Health Survey
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-400">Estimates based on national benchmarks</p>
            <p className="mt-1 text-xs text-slate-400">Your data is private and not shared</p>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4 space-y-1">
          <p className="text-xs text-slate-400">{results.disclaimer}</p>
          <p className="text-xs text-slate-400">Any follow-up discussion will consider your personal objectives, financial situation and needs.</p>
        </div>
      </div>

    </section>
  );
}

/* ── Sub-components ── */

function PanelCard({ children }) {
  return <div className="rounded-[1.5rem] bg-[#172033] p-5 text-white">{children}</div>;
}

function StatBox({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#111827] px-4 py-4 text-center">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
    </div>
  );
}

function ListCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-xs leading-5 text-slate-300">{text}</p>
    </div>
  );
}

function BreakdownCard({ title, items, tone }) {
  const tones = {
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    amber: "border-amber-400/30 bg-amber-500/10 text-amber-100",
    emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  };
  return (
    <div className={`rounded-[1.5rem] border p-5 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em]">{title}</p>
      <div className="mt-4 space-y-2 text-sm leading-6">
        {items.length ? items.map((item) => <p key={item}>· {item}</p>) : <p className="text-xs opacity-70">Nothing major here right now.</p>}
      </div>
    </div>
  );
}

function UrgencyBlock({ label, text }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1.5 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
