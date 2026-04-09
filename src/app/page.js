"use client";

import { useState } from "react";
import ResultsDashboard from "./results";

const QUESTIONS = [
  {
    id: "income",
    category: "Income resilience",
    text: "If your income stopped tomorrow, how quickly would your household feel the pressure?",
    options: [
      "Almost immediately",
      "Within 1 to 2 months",
      "I could manage for a few months",
      "I have a strong buffer",
    ],
  },
  {
    id: "emergency",
    category: "Emergency reserves",
    text: "How many months of core expenses do you currently have in accessible savings?",
    options: ["Less than 1 month", "1 to 3 months", "3 to 6 months", "More than 6 months"],
  },
  {
    id: "debt",
    category: "Debt health",
    text: "How would you describe your debt commitments right now?",
    options: [
      "Repayments are heavy and stressful",
      "I manage repayments but with very little room",
      "Repayments are manageable",
      "I have little or no significant debt",
    ],
  },
  {
    id: "hospital",
    category: "Protection health",
    text: "How confident are you in your hospital or medical coverage?",
    options: [
      "I do not have enough coverage",
      "I have some cover but I am unsure it is enough",
      "I am mostly covered",
      "I am confident my coverage is strong",
    ],
  },
  {
    id: "incomeProtection",
    category: "Protection health",
    text: "If illness or injury stopped you from working, what would replace your income?",
    options: [
      "I do not have a replacement plan",
      "I have partial protection only",
      "I have some protection in place",
      "I have dedicated income protection",
    ],
  },
  {
    id: "dependents",
    category: "Family reliance",
    text: "How many people rely on your income or financial support?",
    options: ["No one", "1 person", "2 people", "3 or more people"],
  },
  {
    id: "retirement",
    category: "Planning health",
    text: "How on track do you feel with your retirement planning?",
    options: [
      "I have not started properly",
      "I have started but I am behind",
      "I am making regular progress",
      "I have a clear plan and feel on track",
    ],
  },
  {
    id: "planning",
    category: "Planning health",
    text: "How clear is your overall financial plan for the next 5 years?",
    options: [
      "I do not have a clear plan",
      "I have broad intentions only",
      "I have a basic plan",
      "I have a clear written strategy",
    ],
  },
  {
    id: "concern",
    category: "Personal priority",
    text: "Which gap worries you the most right now?",
    options: [
      "Running out of cash",
      "Medical bills or protection gaps",
      "Too much debt pressure",
      "Falling behind on long-term goals",
    ],
  },
];

const INITIAL_LEAD = {
  name: "",
  phone: "",
  email: "",
  consent: false,
};

function getOptionScore(questionId, selectedIndex) {
  const scoreMap = {
    income: [24, 46, 70, 90],
    emergency: [22, 48, 74, 92],
    debt: [25, 45, 72, 92],
    hospital: [28, 50, 72, 90],
    incomeProtection: [20, 46, 68, 92],
    dependents: [88, 70, 54, 38],
    retirement: [26, 48, 72, 90],
    planning: [28, 50, 74, 92],
    concern: [55, 55, 55, 55],
  };

  return scoreMap[questionId][selectedIndex];
}

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildResults(answers) {
  const savingsHealth = average([
    getOptionScore("income", answers.income),
    getOptionScore("emergency", answers.emergency),
  ]);

  const debtHealth = getOptionScore("debt", answers.debt);

  let protectionHealth = average([
    getOptionScore("hospital", answers.hospital),
    getOptionScore("incomeProtection", answers.incomeProtection),
  ]);

  const dependentCount = answers.dependents;
  if (dependentCount >= 2 && answers.incomeProtection <= 1) {
    protectionHealth -= 14;
  } else if (dependentCount >= 1 && answers.incomeProtection <= 1) {
    protectionHealth -= 8;
  }

  const planningHealth = average([
    getOptionScore("retirement", answers.retirement),
    getOptionScore("planning", answers.planning),
  ]);

  const total = Math.max(18, average([savingsHealth, debtHealth, protectionHealth, planningHealth]));

  let tier = {
    label: "Stable but Exposed",
    tone: "amber",
    headline: "You may have financial gaps that deserve attention soon.",
    urgency: "These gaps are common, but delaying action increases risk.",
  };

  if (total >= 78) {
    tier = {
      label: "Strong Foundation",
      tone: "emerald",
      headline: "You appear to have a stronger financial foundation than most people who take this check.",
      urgency: "Even strong foundations can weaken when plans are not reviewed regularly.",
    };
  } else if (total < 52) {
    tier = {
      label: "Critical Gaps Identified",
      tone: "rose",
      headline: "You may have critical financial gaps that could affect your long-term stability.",
      urgency: "These gaps are common, but delaying action increases risk.",
    };
  }

  const categories = [
    {
      key: "savings",
      title: "Savings health",
      userScore: savingsHealth,
      benchmarkScore: 71,
      message:
        savingsHealth < 55
          ? "You may not have sufficient emergency reserves if your income is disrupted."
          : savingsHealth < 75
            ? "Your emergency buffer exists, but it may still be thinner than you want in a major setback."
            : "Your savings buffer appears more resilient than average.",
    },
    {
      key: "debt",
      title: "Debt health",
      userScore: debtHealth,
      benchmarkScore: 68,
      message:
        debtHealth < 55
          ? "Debt pressure may reduce your ability to recover quickly from a financial shock."
          : debtHealth < 75
            ? "Your debt looks manageable today, but tighter margins can still become a problem under stress."
            : "Your debt position appears comparatively healthy.",
    },
    {
      key: "protection",
      title: "Protection health",
      userScore: protectionHealth,
      benchmarkScore: 73,
      message:
        protectionHealth < 55
          ? "Your protection coverage may be insufficient for your dependents or current lifestyle."
          : protectionHealth < 75
            ? "You may have some protection in place, but there could still be important blind spots."
            : "Your protection setup appears more robust than average.",
    },
    {
      key: "planning",
      title: "Planning health",
      userScore: planningHealth,
      benchmarkScore: 69,
      message:
        planningHealth < 55
          ? "Your retirement planning may not be on track if priorities keep getting pushed back."
          : planningHealth < 75
            ? "You have planning momentum, but your long-term roadmap may still need sharper structure."
            : "Your planning discipline looks relatively strong.",
    },
  ];

  const priorityMessages = {
    0: "Based on your responses, short-term cash flow pressure may be one of your biggest vulnerabilities.",
    1: "Based on your responses, protection and medical cost exposure may be the area to review first.",
    2: "Based on your responses, debt stress may be limiting your flexibility more than you realise.",
    3: "Based on your responses, the biggest risk may be falling behind on long-term planning while life stays busy.",
  };

  const weakestCategory = [...categories].sort((a, b) => a.userScore - b.userScore)[0];
  const benchmark = 67;
  const comparisonDelta = total - benchmark;
  const comparisonDirection =
    comparisonDelta > 0 ? "above" : comparisonDelta < 0 ? "below" : "matching";
  const comparisonText =
    comparisonDelta > 0
      ? `You are ${comparisonDelta} points above the average Singaporean.`
      : comparisonDelta < 0
        ? `You are ${Math.abs(comparisonDelta)} points below the average Singaporean.`
        : "You are right in line with the average Singaporean.";

  return {
    total,
    tier,
    benchmark,
    comparisonDelta,
    comparisonDirection,
    comparisonText,
    summary: total >= benchmark
      ? "You appear to be holding up better than many Singapore households, but a few blind spots may still deserve attention."
      : "You may have gaps compared to the average Singaporean.",
    categories,
    weakestCategory,
    personalisedOpen:
      priorityMessages[answers.concern] ||
      "Based on your responses, there may be important gaps that deserve closer attention.",
  };
}

export default function FinancialHealthApp() {
  const [stage, setStage] = useState("landing");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState(INITIAL_LEAD);
  const [submitting, setSubmitting] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [results, setResults] = useState(null);

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentStep];
  const canContinue = answers[currentQuestion?.id] !== undefined;

  function selectAnswer(questionId, optionIndex) {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  }

  function nextStep() {
    if (!canContinue) return;

    if (currentStep === QUESTIONS.length - 1) {
      setStage("lead");
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function previousStep() {
    if (currentStep === 0) {
      setStage("landing");
      return;
    }

    setCurrentStep((step) => step - 1);
  }

  function resetFlow() {
    setStage("landing");
    setCurrentStep(0);
    setAnswers({});
    setLead(INITIAL_LEAD);
    setLeadError("");
    setResults(null);
  }
  async function unlockReport(event) {
    event.preventDefault();
    setLeadError("");

    if (!lead.name || !lead.phone || !lead.email || !lead.consent) {
      setLeadError("Please complete all fields and confirm consent to unlock your full report.");
      return;
    }

    const builtResults = buildResults(answers);
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead,
          answers,
          result: builtResults,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to unlock your report right now.");
      }

      setResults(builtResults);
      setStage("results");
    } catch (error) {
      setLeadError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbfb_0%,_#eef4f3_100%)] text-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            <CompassIcon />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Meridian Advisory</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Financial self-assessment
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm md:flex">
          <span>Aligned with Singapore financial guidelines</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        {stage === "landing" ? (
          <section className="grid gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                Aligned with Singapore financial guidelines
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  How Do You Compare Financially to the Average Singaporean?
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Get your Singapore Financial Health Index (SFHI) in 3 minutes — and uncover the gaps you might be missing.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setStage("quiz")}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
                >
                  Start Free Assessment
                  <ArrowRightIcon />
                </button>
                <p className="text-sm leading-6 text-slate-500">Low friction. Private. Built for real client conversations.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <TrustCard
                  title="Structured Assessment"
                  text="Built on key financial planning principles used in Singapore"
                />
                <TrustCard
                  title="Benchmark Comparison"
                  text="See how you rank against typical Singapore financial levels"
                />
                <TrustCard
                  title="Confidential"
                  text="Your data is private and secure"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-600">Why this works</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Curiosity creates the click. Clarity creates the consultation.
                </h2>
                <div className="grid gap-4">
                  <InsightCard
                    title="Personal relevance"
                    text="People want to know where they stand, especially when they feel they should already be doing okay."
                  />
                  <InsightCard
                    title="Gap discovery"
                    text="Seeing hidden weak spots often triggers more action than hearing generic advice."
                  />
                  <InsightCard
                    title="Low friction"
                    text="A short assessment lowers resistance and gets users invested before you ask for their details."
                  />
                </div>
                <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
                  This tool provides general financial information and does not constitute financial advice.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {stage === "quiz" ? (
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] transition-all sm:p-8">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <span>{currentQuestion.category}</span>
                  <span>
                    Step {currentStep + 1} of {QUESTIONS.length}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">
                  Answer honestly — this helps us assess your real financial position
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  const selected = answers[currentQuestion.id] === index;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(currentQuestion.id, index)}
                      className={`flex items-center justify-between rounded-3xl border px-5 py-4 text-left transition ${
                        selected
                          ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <span className="pr-4 text-base font-medium">{option}</span>
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full border ${
                          selected
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">No right or wrong answers</div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={previousStep}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={nextStep}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {currentStep === QUESTIONS.length - 1 ? "Continue" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {stage === "lead" ? (
          <section className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
              <div className="space-y-5">
                <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  Final step before your results
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Unlock Your Full Financial Analysis
                  </h2>
                  <p className="text-base leading-7 text-slate-600">
                    See your SFHI score, comparison to Singapore, and personalised insights
                  </p>
                </div>

                <div className="grid gap-4">
                  <ValueRow
                    title="Potential financial blind spots"
                    text="See which parts of your current setup may be leaving you exposed."
                  />
                  <ValueRow
                    title="Urgency-based result framing"
                    text="Results are written to help users understand what delaying action could cost."
                  />
                  <ValueRow
                    title="Trusted positioning"
                    text="Used by professionals, confidential and secure, and aligned with Singapore financial guidelines."
                  />
                </div>
              </div>

              <form className="space-y-5" onSubmit={unlockReport}>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Name</span>
                  <input
                    type="text"
                    value={lead.name}
                    onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                    placeholder="Your full name"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Phone number</span>
                  <input
                    type="tel"
                    value={lead.phone}
                    onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                    placeholder="+65 9123 4567"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Email</span>
                  <input
                    type="email"
                    value={lead.email}
                    onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={lead.consent}
                    onChange={(event) =>
                      setLead((current) => ({ ...current, consent: event.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm leading-6 text-slate-700">
                    I consent to be contacted by a licensed financial representative.
                  </span>
                </label>

                {leadError ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {leadError}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStage("quiz")}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {submitting ? "Unlocking..." : "Unlock Your Full Financial Analysis"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}

        {stage === "results" && results ? <ResultsDashboard results={results} lead={lead} /> : null}
      </main>
    </div>
  );
}
function TrustCard({ title, text }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function InsightCard({ title, text }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ValueRow({ title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
