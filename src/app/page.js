"use client";

import { useMemo, useState } from "react";
import ResultsDashboard from "./results";

const QUESTIONS = [
  {
    id: "age",
    type: "slider",
    category: "Profile",
    text: "How old are you?",
    prompt: "Slide to your age so we can compare you with people like you in Singapore.",
    min: 18,
    max: 99,
    step: 1,
    defaultValue: 30,
    suffix: "years old",
  },
  {
    id: "relationship",
    type: "single",
    category: "Profile",
    text: "What is your relationship status?",
    prompt: "This helps us frame responsibilities and planning needs.",
    options: ["Single", "Married", "Partnered", "Separated or divorced"],
  },
  {
    id: "children",
    type: "slider",
    category: "Profile",
    text: "How many children do you have?",
    prompt: "If none, leave it at zero.",
    min: 0,
    max: 6,
    step: 1,
    defaultValue: 0,
    suffix: "children",
  },
  {
    id: "employment",
    type: "single",
    category: "Profile",
    text: "What best describes your employment status?",
    prompt: "Pick the one that best matches your current situation.",
    options: ["Employed full-time", "Self-employed", "Part-time or contract", "Currently not working"],
  },
  {
    id: "emergencyFund",
    type: "single",
    category: "Financial stability",
    text: "Do you currently have an emergency fund covering 3 to 6 months of expenses?",
    prompt: "This is one of the clearest indicators of financial resilience.",
    options: ["No", "Partially", "Almost there", "Yes"],
  },
  {
    id: "debtManagement",
    type: "single",
    category: "Financial stability",
    text: "How well do you manage debt today?",
    prompt: "We are looking for pressure, not perfection.",
    options: ["Poorly", "Could be better", "Reasonably well", "Very well"],
  },
  {
    id: "cbsScore",
    type: "single",
    category: "Financial stability",
    text: "Have you checked your CBS credit score recently?",
    prompt: "A surprising number of people only think about this when it is already urgent.",
    options: ["Never", "Not recently", "Within the past year", "Yes, and I monitor it"],
  },
  {
    id: "cpfAllocation",
    type: "single",
    category: "CPF and government",
    text: "Do you understand your CPF allocation across OA, SA, and MA?",
    prompt: "This is a big Singapore advantage if you understand it well.",
    options: ["Not at all", "A little", "Mostly", "Very clearly"],
  },
  {
    id: "cpfTopups",
    type: "single",
    category: "CPF and government",
    text: "Have you done CPF top-ups before?",
    prompt: "This is about awareness and usage, not a recommendation.",
    options: ["No", "I have considered it", "Occasionally", "Yes, intentionally"],
  },
  {
    id: "govBenefits",
    type: "multi",
    category: "CPF and government",
    text: "Which of these are you actively maximising?",
    prompt: "Select all that apply.",
    options: ["Baby Bonus", "GST vouchers / CDC vouchers", "None of these"],
  },
  {
    id: "cpfRetirementSum",
    type: "single",
    category: "CPF and government",
    text: "Do you know your CPF retirement sum target?",
    prompt: "Many people know CPF matters, but not the actual target numbers.",
    options: ["No idea", "Roughly", "Mostly", "Yes, clearly"],
  },
  {
    id: "protectionPlans",
    type: "multi",
    category: "Protection",
    text: "Which protection plans do you already have?",
    prompt: "Select all that apply.",
    options: ["Hospitalisation plan", "Life insurance", "Critical illness", "Income protection", "None"],
  },
  {
    id: "coverageEnough",
    type: "multi",
    category: "Protection",
    text: "What do you feel your current coverage is enough for?",
    prompt: "Select all that apply.",
    options: ["Dependents", "Liabilities", "Not sure yet"],
  },
  {
    id: "housingType",
    type: "single",
    category: "Housing",
    text: "Which best describes your housing situation?",
    prompt: "Housing is a major part of financial life in Singapore.",
    options: ["No property yet", "HDB", "Condo or private property", "Living with family"],
  },
  {
    id: "mortgageCovered",
    type: "single",
    category: "Housing",
    text: "If you have a mortgage, is it adequately covered?",
    prompt: "If not applicable, choose the closest answer.",
    options: ["No", "Not sure", "Mostly", "Yes / not applicable"],
  },
  {
    id: "cpfHousing",
    type: "single",
    category: "Housing",
    text: "Are you using CPF for housing in a way you understand well?",
    prompt: "This helps reveal whether housing decisions are part of your bigger plan.",
    options: ["No", "Not really", "Somewhat", "Yes"],
  },
  {
    id: "investments",
    type: "multi",
    category: "Investments",
    text: "Which of these do you invest in today?",
    prompt: "Select all that apply.",
    options: ["Stocks / ETFs", "Robo-advisors", "CPF-SA top-ups", "SSB / T-bills", "None"],
  },
  {
    id: "investmentReview",
    type: "single",
    category: "Investments",
    text: "Do you review your investments at least once a year?",
    prompt: "Consistency usually matters more than complexity.",
    options: ["Never", "Rarely", "Sometimes", "Yes"],
  },
  {
    id: "budgeting",
    type: "single",
    category: "Money habits",
    text: "Do you budget monthly?",
    prompt: "A simple habit can create a big difference over time.",
    options: ["Never", "Sometimes", "Usually", "Always"],
  },
  {
    id: "trackExpenses",
    type: "single",
    category: "Money habits",
    text: "Do you track your expenses?",
    prompt: "This is often where people discover their real spending pattern.",
    options: ["Never", "Occasionally", "Usually", "Consistently"],
  },
  {
    id: "reviewBills",
    type: "single",
    category: "Money habits",
    text: "Do you review subscriptions and recurring bills?",
    prompt: "Small leaks can quietly add up.",
    options: ["Never", "Rarely", "Sometimes", "Yes, regularly"],
  },
  {
    id: "retirementPlanning",
    type: "single",
    category: "Future planning",
    text: "How are you planning for retirement today?",
    prompt: "This is not about perfection. It is about direction.",
    options: ["I have not started", "I have loose ideas", "I have some structure", "I have a clear plan"],
  },
  {
    id: "will",
    type: "single",
    category: "Future planning",
    text: "Do you already have a will?",
    prompt: "This is one of the most commonly delayed planning steps.",
    options: ["No", "Not yet but I plan to", "In progress", "Yes"],
  },
  {
    id: "nominees",
    type: "single",
    category: "Future planning",
    text: "Do you have nominees set up for CPF or insurance where relevant?",
    prompt: "This is easy to overlook until it matters.",
    options: ["No", "Not sure", "Partially", "Yes"],
  },
];

const INITIAL_LEAD = { name: "", phone: "", email: "", consent: false };
const MULTI_NONE_FIELDS = { govBenefits: "None of these", protectionPlans: "None", investments: "None" };

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getAgeBenchmark(age) {
  if (age <= 24) return { score: 50, label: "18 to 24", stage: "Early adulthood" };
  if (age <= 30) return { score: 57, label: "25 to 30", stage: "Career building" };
  if (age <= 40) return { score: 64, label: "31 to 40", stage: "Growth years" };
  if (age <= 55) return { score: 68, label: "41 to 55", stage: "Peak responsibility years" };
  return { score: 71, label: "56+", stage: "Retirement preparation" };
}

function scoreSingle(answerIndex) {
  return [25, 50, 75, 92][answerIndex] ?? 25;
}

function scoreSlider(questionId, value) {
  if (questionId === "age") return 70;
  if (questionId === "children") return value === 0 ? 80 : Math.max(45, 85 - value * 5);
  return 60;
}

function scoreMulti(questionId, selected, answers) {
  const picked = Array.isArray(selected) ? selected : [];
  if (questionId === "govBenefits") {
    if (picked.includes("None of these")) return answers.children > 0 ? 20 : 45;
    let base = picked.length * 35;
    if (answers.children > 0 && picked.includes("Baby Bonus")) base += 15;
    return Math.min(95, base);
  }
  if (questionId === "protectionPlans") {
    if (picked.includes("None")) return 12;
    return Math.min(96, picked.length * 24);
  }
  if (questionId === "coverageEnough") {
    if (picked.includes("Not sure yet")) return 28;
    return Math.min(92, picked.length * 42);
  }
  if (questionId === "investments") {
    if (picked.includes("None")) return 18;
    return Math.min(94, 28 + picked.length * 16);
  }
  return 40;
}

function getValueScore(question, answers) {
  const value = answers[question.id];
  if (question.type === "slider") return scoreSlider(question.id, value ?? question.defaultValue);
  if (question.type === "multi") return scoreMulti(question.id, value, answers);
  return scoreSingle(value ?? 0);
}

function saveLeadToBrowser(submission) {
  if (typeof window === "undefined") return;
  const key = "financial-health-check-leads";
  const current = JSON.parse(window.localStorage.getItem(key) || "[]");
  current.push({ id: crypto.randomUUID(), submittedAt: new Date().toISOString(), ...submission });
  window.localStorage.setItem(key, JSON.stringify(current));
}

function buildResults(answers) {
  const benchmark = getAgeBenchmark(answers.age ?? 30);
  const sections = [
    {
      key: "stability",
      title: "Financial stability",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "emergencyFund"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "debtManagement"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "cbsScore"), answers),
      ]),
      benchmarkScore: benchmark.score + 6,
      risk: "Your buffer, debt discipline, or credit awareness may need more attention.",
      action: "Strengthen your emergency reserve and reduce any avoidable debt pressure.",
    },
    {
      key: "cpf",
      title: "CPF optimisation",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "cpfAllocation"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "cpfTopups"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "govBenefits"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "cpfRetirementSum"), answers),
      ]),
      benchmarkScore: benchmark.score + 8,
      risk: "You may not be fully using CPF and government benefits as a long-term advantage.",
      action: "Treat CPF and available schemes as part of your plan rather than background admin.",
    },
    {
      key: "protection",
      title: "Insurance coverage",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "protectionPlans"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "coverageEnough"), answers),
      ]),
      benchmarkScore: benchmark.score + 9,
      risk: "Your protection setup may not fully cover your responsibilities, liabilities, or lifestyle.",
      action: "Review whether your current protection matches your dependents and major obligations.",
    },
    {
      key: "housing",
      title: "Housing planning",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "housingType"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "mortgageCovered"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "cpfHousing"), answers),
      ]),
      benchmarkScore: benchmark.score + 4,
      risk: "Housing decisions may be happening without enough protection or CPF clarity behind them.",
      action: "Make sure your housing choices fit your broader cash flow and CPF strategy.",
    },
    {
      key: "investments",
      title: "Investment positioning",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "investments"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "investmentReview"), answers),
      ]),
      benchmarkScore: benchmark.score + 5,
      risk: "Your investments may be too inactive, too fragmented, or not reviewed often enough.",
      action: "Build a simpler investment rhythm and review it consistently each year.",
    },
    {
      key: "habits",
      title: "Money habits",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "budgeting"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "trackExpenses"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "reviewBills"), answers),
      ]),
      benchmarkScore: benchmark.score + 2,
      risk: "Day-to-day money habits may be limiting how much control you really have over your finances.",
      action: "Tighten the simple habits that improve visibility and reduce leaks every month.",
    },
    {
      key: "future",
      title: "Future planning",
      userScore: average([
        getValueScore(QUESTIONS.find((q) => q.id === "retirementPlanning"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "will"), answers),
        getValueScore(QUESTIONS.find((q) => q.id === "nominees"), answers),
      ]),
      benchmarkScore: benchmark.score + 6,
      risk: "Your longer-term planning may still have gaps around retirement, estate planning, or nomination details.",
      action: "Move key planning steps from someday to scheduled action.",
    },
  ].map((section) => ({ ...section, delta: section.userScore - section.benchmarkScore }));

  const total = Math.round(average(sections.map((section) => section.userScore)));
  let tier = { grade: "C", label: "Average, gaps present", tone: "amber" };
  if (total >= 85) tier = { grade: "A", label: "Optimised, financially strong", tone: "emerald" };
  else if (total >= 72) tier = { grade: "B", label: "Good, minor improvements", tone: "emerald" };
  else if (total < 55) tier = { grade: "D", label: "Weak, needs attention", tone: "rose" };
  if (total < 40) tier = { grade: "E", label: "High risk", tone: "rose" };

  const sorted = [...sections].sort((a, b) => a.userScore - b.userScore);
  const needsWork = sorted.filter((section) => section.userScore < 55).map((section) => section.title);
  const okay = sections.filter((section) => section.userScore >= 55 && section.userScore < 75).map((section) => section.title);
  const strong = sections.filter((section) => section.userScore >= 75).map((section) => section.title);
  const topRisks = sorted.slice(0, 3).map((section) => ({ title: section.title, text: section.risk }));
  const topActions = sorted.slice(0, 3).map((section) => ({ title: section.title, text: section.action }));

  const comparisonDelta = total - benchmark.score;
  const comparisonText = comparisonDelta > 0
    ? `You are ${comparisonDelta} points above people in Singapore aged ${benchmark.label}.`
    : comparisonDelta < 0
      ? `You are ${Math.abs(comparisonDelta)} points below people in Singapore aged ${benchmark.label}.`
      : `You are roughly in line with people in Singapore aged ${benchmark.label}.`;

  const hiddenOpportunity = sections.find((section) => section.key === "cpf")?.userScore < 75
    ? "CPF is likely your biggest local advantage. Better understanding and usage here can quietly improve long-term outcomes more than many people realise."
    : answers.children > 0
      ? "With children in the picture, optimising Baby Bonus, household cash flow, and protection can create a bigger impact than chasing complexity."
      : "Your next gain may come less from earning more and more from making your current structure work together more intentionally.";

  return {
    total,
    benchmark: benchmark.score,
    ageLabel: benchmark.label,
    lifeStage: benchmark.stage,
    tier,
    comparisonText,
    teaser: total < benchmark.score
      ? "You may have a few hidden gaps compared with people in a similar life stage in Singapore."
      : "You appear to be doing well in parts of your financial life, but there may still be areas worth tightening.",
    sections,
    needsWork,
    okay,
    strong,
    topRisks,
    topActions,
    strongestArea: [...sections].sort((a, b) => b.userScore - a.userScore)[0],
    weakestArea: sorted[0],
    hiddenOpportunity,
    disclaimer: "This tool provides general financial insights and does not constitute financial advice under MAS regulations.",
  };
}
export default function FinancialHealthApp() {
  const [stage, setStage] = useState("landing");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({ age: 30, children: 0 });
  const [lead, setLead] = useState(INITIAL_LEAD);
  const [results, setResults] = useState(null);
  const [leadError, setLeadError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const teaserResults = useMemo(() => (QUESTIONS.every((question) => hasAnswer(question, answers)) ? buildResults(answers) : null), [answers]);
  const canContinue = hasAnswer(currentQuestion, answers);

  function setSingle(questionId, value) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function setSlider(questionId, value) {
    setAnswers((current) => ({ ...current, [questionId]: Number(value) }));
  }

  function toggleMulti(question, option) {
    setAnswers((current) => {
      const existing = Array.isArray(current[question.id]) ? current[question.id] : [];
      const noneOption = MULTI_NONE_FIELDS[question.id];
      let next = existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option];
      if (noneOption) {
        if (option === noneOption && !existing.includes(option)) next = [noneOption];
        else if (option !== noneOption) next = next.filter((item) => item !== noneOption);
      }
      return { ...current, [question.id]: next };
    });
  }

  function nextStep() {
    if (!canContinue) return;
    if (currentStep === QUESTIONS.length - 1) {
      setStage("teaser");
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

  async function unlockReport(event) {
    event.preventDefault();
    setLeadError("");
    if (!lead.name || !lead.phone || !lead.email || !lead.consent) {
      setLeadError("Please complete all fields and provide consent to unlock your full report.");
      return;
    }

    const builtResults = teaserResults || buildResults(answers);
    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, answers, result: builtResults }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to save your lead right now.");
    } catch {
      saveLeadToBrowser({ lead, answers, result: builtResults, storage: "browser" });
    } finally {
      setSubmitting(false);
      setResults(builtResults);
      setStage("results");
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white"><CompassIcon /></div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Meridian Advisory</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Singapore Financial Health Score</p>
          </div>
        </div>
        <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 md:block">MAS-aware insight tool</div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        {stage === "landing" ? (
          <section className="grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">Singapore version of Money MOT · CPF-focused · Action-oriented</div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">What’s Your Financial Health Score in Singapore?</h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">Take a quick self-check on your finances, CPF, protection, housing, habits, and future planning to see where you are strong and where gaps may be hiding.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={() => setStage("quiz")} className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white transition hover:bg-slate-800">Start Free Check<ArrowRightIcon /></button>
                <p className="text-sm leading-6 text-slate-500">Private. Fast. Designed for Singapore adults who want clarity without jargon.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoCard title="CPF edge" text="Most tools ignore CPF. This one uses it as a core part of your financial health." />
                <InfoCard title="Local relevance" text="Questions cover CBS, Baby Bonus, vouchers, housing, and CPF usage." />
                <InfoCard title="No shame" text="The flow is simple, non-intimidating, and built to surface gaps without judgment." />
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="grid gap-4">
                <FeatureCard title="Needs work" text="Emergency fund, CPF optimisation, insurance coverage" tone="rose" />
                <FeatureCard title="Okay" text="Budgeting, expense tracking, housing awareness" tone="amber" />
                <FeatureCard title="Strong" text="Basic savings, yearly review habits, future planning" tone="emerald" />
              </div>
              <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">This tool provides general financial insights and does not constitute financial advice under MAS regulations.</p>
            </div>
          </section>
        ) : null}

        {stage === "quiz" ? (
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"><span>{currentQuestion.category}</span><span>Step {currentStep + 1} of {QUESTIONS.length}</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Answer honestly — this helps us assess your real financial position</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{currentQuestion.text}</h2>
                <p className="max-w-2xl text-base leading-7 text-slate-500">{currentQuestion.prompt}</p>
              </div>

              {currentQuestion.type === "slider" ? <SliderQuestion question={currentQuestion} value={answers[currentQuestion.id] ?? currentQuestion.defaultValue} onChange={(value) => setSlider(currentQuestion.id, value)} /> : null}

              {currentQuestion.type === "single" ? (
                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const selected = answers[currentQuestion.id] === index;
                    return <button key={option} type="button" onClick={() => setSingle(currentQuestion.id, index)} className={`flex items-center justify-between rounded-3xl border px-5 py-4 text-left transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"}`}><span className="pr-4 text-base font-medium">{option}</span><span className={`grid h-7 w-7 place-items-center rounded-full border ${selected ? "border-white/20 bg-white/10" : "border-slate-300 bg-white text-transparent"}`}><CheckIcon /></span></button>;
                  })}
                </div>
              ) : null}

              {currentQuestion.type === "multi" ? (
                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const selected = (answers[currentQuestion.id] || []).includes(option);
                    return <button key={option} type="button" onClick={() => toggleMulti(currentQuestion, option)} className={`flex items-center justify-between rounded-3xl border px-5 py-4 text-left transition ${selected ? "border-sky-500 bg-sky-50 text-slate-950 shadow-sm" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"}`}><span className="pr-4 text-base font-medium">{option}</span><span className={`grid h-7 w-7 place-items-center rounded-full border ${selected ? "border-sky-500 bg-sky-500 text-white" : "border-slate-300 bg-white text-transparent"}`}><CheckIcon /></span></button>;
                  })}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">No right or wrong answers</div>
                <div className="flex gap-3">
                  <button type="button" onClick={previousStep} className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">Back</button>
                  <button type="button" disabled={!canContinue} onClick={nextStep} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">{currentStep === QUESTIONS.length - 1 ? "See My Score" : "Next"}</button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {stage === "teaser" && teaserResults ? (
          <section className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-5">
                <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">Your preliminary result</div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your Singapore Financial Health Grade is {teaserResults.tier.grade}</h2>
                <p className="text-base leading-7 text-slate-600">{teaserResults.teaser}</p>
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Compared with {teaserResults.ageLabel} in Singapore</p>
                  <p className="mt-3 text-2xl font-semibold">{teaserResults.comparisonText}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Unlock your full dashboard to see what needs work, what is okay, what is strong, and your top opportunities.</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 p-6">
                <div className="space-y-4 blur-[3px]"><BlurCard /><BlurCard /><BlurCard /></div>
                <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
                  <div className="max-w-sm rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Unlock your full financial report and personalised insights</p>
                    <p className="mt-3 text-base leading-7 text-slate-600">Get your full grade, breakdown, top risks, actions, and hidden CPF opportunity.</p>
                    <button type="button" onClick={() => setStage("lead")} className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Unlock My Report</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {stage === "lead" && teaserResults ? (
          <section className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-5">
                <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">One more step</div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Unlock your full financial report and personalised insights</h2>
                <p className="text-base leading-7 text-slate-600">See your complete Singapore Financial Health Score dashboard, local comparison, and action areas.</p>
                <div className="grid gap-4">
                  <ValueRow title="What you will unlock" text="Grade, local benchmark, section breakdown, needs work / okay / strong, and next-step insights." />
                  <ValueRow title="Why this is useful" text="This gives you a simpler view of what matters most before speaking to anyone." />
                  <ValueRow title="Trust" text="Private, confidential, no spam, and framed as financial insights rather than advice." />
                </div>
              </div>
              <form className="space-y-5" onSubmit={unlockReport}>
                <Input label="Name" value={lead.name} onChange={(value) => setLead((current) => ({ ...current, name: value }))} placeholder="Your full name" />
                <Input label="Email" value={lead.email} onChange={(value) => setLead((current) => ({ ...current, email: value }))} placeholder="you@example.com" type="email" />
                <Input label="Phone" value={lead.phone} onChange={(value) => setLead((current) => ({ ...current, phone: value }))} placeholder="+65 9123 4567" type="tel" />
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><input type="checkbox" checked={lead.consent} onChange={(event) => setLead((current) => ({ ...current, consent: event.target.checked }))} className="mt-1 h-4 w-4 rounded border-slate-300" /><span className="text-sm leading-6 text-slate-700">I consent to be contacted by a licensed financial representative for a confidential follow-up.</span></label>
                {leadError ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{leadError}</p> : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={() => setStage("teaser")} className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">Back</button>
                  <button type="submit" disabled={submitting} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">{submitting ? "Unlocking..." : "Unlock Full Report"}</button>
                </div>
                <p className="text-sm text-slate-500">Private and confidential. No spam. General insights only.</p>
              </form>
            </div>
          </section>
        ) : null}

        {stage === "results" && results ? <ResultsDashboard results={results} lead={lead} /> : null}
      </main>
    </div>
  );
}
function hasAnswer(question, answers) {
  if (!question) return false;
  if (question.type === "slider") return answers[question.id] !== undefined;
  if (question.type === "multi") return Array.isArray(answers[question.id]) && answers[question.id].length > 0;
  return answers[question.id] !== undefined;
}

function SliderQuestion({ question, value, onChange }) {
  return (
    <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Selected value</p>
          <p className="mt-2 text-4xl font-semibold text-slate-950">{value}</p>
        </div>
        <p className="text-sm text-slate-500">{question.suffix}</p>
      </div>
      <input type="range" min={question.min} max={question.max} step={question.step} value={value} onChange={(event) => onChange(event.target.value)} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-600" />
      <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"><span>{question.min}</span><span>{question.max}</span></div>
    </div>
  );
}

function InfoCard({ title, text }) {
  return <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>;
}

function FeatureCard({ title, text, tone }) {
  const toneClasses = {
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return <div className={`rounded-[1.5rem] border p-5 ${toneClasses[tone]}`}><p className="text-sm font-semibold uppercase tracking-[0.2em]">{title}</p><p className="mt-2 text-sm leading-6 text-slate-700">{text}</p></div>;
}

function ValueRow({ title, text }) {
  return <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>;
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950" placeholder={placeholder} /></label>;
}

function BlurCard() {
  return <div className="h-28 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm" />;
}

function ArrowRightIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>;
}

function CompassIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" /></svg>;
}

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}
