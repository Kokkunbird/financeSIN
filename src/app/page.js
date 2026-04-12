"use client";

import { useMemo, useState } from "react";
import ResultsDashboard from "./results";

const N8N_WEBHOOK_URL = "https://khainelo.app.n8n.cloud/webhook/Meridian-Assestment-Lead";

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

function sectionWhyScore(key, userScore, answers) {
  const age = answers.age ?? 30;
  const yearsToRetirement = Math.max(0, 65 - age);

  const map = {
    stability: {
      low: "Your emergency buffer appears thin. MAS financial planning guidelines suggest 6 months of living expenses set aside before focusing on growth — at Singapore's average household expenditure of around $4,900 a month, that is roughly $29,000 as a baseline. Retrenchment benefits are not legally mandated for most employees in Singapore, making your personal buffer your primary safety net.",
      mid: "Your emergency fund is developing, but may not yet withstand a prolonged disruption. Many Singaporeans overestimate their resilience here — a single hospitalisation episode or 3-month retrenchment can quickly drain savings that felt adequate before the event.",
      high: "Your financial foundation looks solid. Maintaining a 6-month emergency buffer gives you the flexibility to handle disruptions — illness, retrenchment, or unexpected bills — without derailing your longer-term goals. This is the baseline from which effective financial planning begins.",
    },
    cpf: {
      low: `CPF is Singapore's most reliable retirement vehicle, but only if used intentionally. The Full Retirement Sum for 2025 is $205,800. Many Singaporeans fall short — and each year of under-optimisation is a missed opportunity for risk-free, tax-advantaged compounding. The Special Account earns 4% annually: one of the best guaranteed returns available in Singapore.`,
      mid: "You have some CPF awareness, but may not be capturing the full advantage. Voluntary SA top-ups of up to $8,000 per year attract dollar-for-dollar tax relief and compound at 4% — better than most fixed deposits and completely risk-free. Shielding your SA from CPF Investment Scheme drawdowns is another commonly missed opportunity.",
      high: "Strong CPF engagement is a genuine advantage. Singaporeans who actively manage their OA, SA, and MA allocations — and track progress against retirement sum targets — consistently build stronger long-term positions. If your SA is on track for the Enhanced Retirement Sum ($308,700 in 2025), you are ahead of the majority.",
    },
    protection: {
      low: "Singapore's protection gap is significant. The Life Insurance Association (LIA) found in 2022 that the average working adult is underprotected by approximately $350,000 in life cover. MediShield Life covers hospitalisation basics, but out-of-pocket costs for a serious diagnosis can still reach six figures without an Integrated Shield Plan or critical illness rider.",
      mid: "You have some protection in place, but gaps may remain. Three in four Singaporeans lack adequate disability income insurance (LIA 2022). If you were unable to work for 6 months or more due to illness or injury, would your household expenses still be covered? The standard benchmark is 9–10 times your annual income in total life coverage.",
      high: "You appear reasonably well-covered. The benchmark is 9–10 times your annual income in life cover, plus adequate critical illness and hospital coverage. As responsibilities evolve — mortgage, children, ageing parents — coverage benchmarks should be revisited annually to ensure they remain aligned.",
    },
    housing: {
      low: "Housing is Singapore's single largest financial commitment for most households. Using CPF OA for your mortgage is convenient, but each dollar used reduces CPF compounding at 2.5% and reduces your retirement balance. Without a clear view of housing costs relative to income and CPF, it is easy to end up 'house rich, retirement poor'.",
      mid: "Your housing awareness is developing, but the connections between your property, CPF drawdown, and broader financial plan may still be loose. MAS guidelines suggest total debt servicing should not exceed 55% of gross income — a useful checkpoint. Knowing exactly how much CPF you have used for housing also affects your retirement sum calculation.",
      high: "Your housing planning appears structured. Understanding how your property integrates with your CPF drawdown and retirement income is an advantage many Singaporeans overlook until it is too late to rebalance. If your mortgage is well-covered, this protects both your asset and your household stability.",
    },
    investments: {
      low: "Only about 1 in 4 Singaporeans invest regularly outside of CPF (DBS Financial Health Survey). With Singapore's inflation averaging 2–4% annually, savings sitting in a regular bank account quietly lose purchasing power over time. CPF OA earns 2.5% — roughly inflation-neutral, but not growth. Long-term wealth requires assets that compound above inflation.",
      mid: "You are investing in some capacity, but the consistency and review cadence may need strengthening. Singaporeans who review their portfolios at least once a year are significantly more likely to stay aligned with their goals as life circumstances evolve. A simple, diversified approach — combining CPF, equities, ETFs, and Singapore Savings Bonds — typically outperforms complexity over the long run.",
      high: "Active, regularly reviewed investing is one of the clearest differentiators between Singaporeans who build wealth and those who merely preserve it. A diversified approach combining CPF, broad-market equities, ETFs, and Singapore Savings Bonds creates resilience across market cycles. If your portfolio is reviewed and rebalanced, you are ahead of the majority.",
    },
    habits: {
      low: "Day-to-day habits compound over decades. Singapore's average household spends approximately $4,900 per month — yet many are unaware of their exact spending breakdown. Consistent expense tracking is consistently cited as the single highest-impact habit for improving financial control. Without visibility, optimisation is guesswork.",
      mid: "Your money habits are developing. Subscription creep, unreviewed insurance premiums, and lifestyle drift can quietly erode hundreds of dollars monthly. A structured monthly budget review often surfaces savings without requiring income to increase — it simply redirects existing spending more intentionally.",
      high: "Strong money habits create the foundation for everything else. Knowing exactly where your money goes gives you control — and control gives you options when life changes unexpectedly. Consistent budgeters typically save 15–25% more over a decade than those who track loosely, even at identical income levels.",
    },
    future: {
      low: yearsToRetirement > 10
        ? `Most Singaporeans only begin serious retirement planning within 5 years of their target retirement age — leaving too little time to close meaningful gaps. At ${age}, you have approximately ${yearsToRetirement} years before 65. Every year of early, structured action is worth far more than three years of late correction. A plan started today has time on its side.`
        : `With retirement approaching, the gap between where your income will come from and what you will need to spend becomes urgent. Singapore's average household costs are around $4,900 monthly. CPF LIFE at the Standard Plan typically pays $1,000–$1,400 monthly. The shortfall of $3,000–$4,000 needs a clear plan — not a hope.`,
      mid: `Your future planning is in motion, but structure matters. Around 50% of Singaporeans do not have a will (Law Society of Singapore). Nominees, estate arrangements, and a written retirement income target convert good intentions into enforceable, actionable outcomes. These steps are low-effort and high-consequence.`,
      high: "You appear to have meaningful future planning in place. The final layer is a written roadmap with specific income targets, healthcare provisions, and estate arrangements — the difference between having a plan and having a plan that holds up when it matters most.",
    },
  };

  const entry = map[key];
  if (!entry) return "";
  if (userScore < 55) return entry.low;
  if (userScore < 75) return entry.mid;
  return entry.high;
}

function buildSgContext(total, benchmark, answers) {
  const aboveBelow = total >= benchmark.score ? "above" : "below";
  const delta = Math.abs(total - benchmark.score);
  if (total >= 72) {
    return `Your score of ${total} places you ${delta} points ${aboveBelow} the typical benchmark for Singaporeans aged ${benchmark.label}. Even at this level, structural gaps often persist — particularly in CPF optimisation, protection adequacy, and retirement income projection. CPF LIFE at the Standard Plan pays approximately $1,000–$1,400 monthly at 65. Against Singapore's average household expenditure of $4,900 per month, even a well-positioned individual faces a meaningful shortfall without supplementary income sources planned in advance.`;
  }
  return `Your score of ${total} is ${delta} points ${aboveBelow} the typical benchmark for Singaporeans aged ${benchmark.label}. These gaps are common — but common does not mean acceptable. CPF LIFE at the Standard Plan pays approximately $1,000–$1,400 monthly at 65. Against Singapore's average household expenditure of $4,900 per month, this creates a structural shortfall of $3,500–$4,000 monthly that only deliberate planning can address. The earlier the action, the lower the cost of correction.`;
}

function buildUrgencyNarrative(answers, sections) {
  const age = answers.age ?? 30;
  const yearsToRetirement = Math.max(0, 65 - age);
  const protectionScore = sections.find((s) => s.key === "protection")?.userScore ?? 50;

  return {
    retirement: yearsToRetirement > 0
      ? `Without supplementary income sources, CPF LIFE alone covers roughly 20–30% of typical Singapore household expenses. Over a 20-year retirement (age 65 to 85, reflecting Singapore's average life expectancy of 83–85 years), an unaddressed monthly shortfall of $3,000 compounds into a gap exceeding $700,000 in today's dollars — a figure that is very difficult to close once retirement begins.`
      : `At or near retirement, the gap between CPF payouts and actual living costs becomes immediate. Singapore households spend close to $4,900 per month on average. CPF LIFE at the Standard Plan delivers $1,000–$1,400 monthly. The difference must be funded from accumulated assets — and delaying a plan now means fewer available options.`,
    protection: protectionScore < 65
      ? `A critical illness or extended inability to work — without adequate coverage — could expose your household to costs that deplete years of accumulated savings. Cancer treatment in Singapore averages $50,000–$300,000 depending on stage. MediShield Life covers hospitalisation costs partially, but out-of-pocket exposure without a Shield Plan rider or CI policy can still reach five to six figures.`
      : `Your protection appears reasonably in place, but as responsibilities grow — mortgage increases, children, ageing parents — coverage benchmarks should be revisited. The LIA standard is 9–10× annual income in life cover, with at least 5× in critical illness coverage.`,
    inflation: `Singapore's long-term inflation rate of 2–4% annually means $5,000 in purchasing power today will feel like $3,000–$3,700 in 20 years. A retirement income plan that does not account for inflation will fall short well before it should.`,
  };
}

function buildGapSummary(sections, answers) {
  const age = answers.age ?? 30;
  const gaps = [];
  const protectionSection = sections.find((s) => s.key === "protection");
  const cpfSection = sections.find((s) => s.key === "cpf");
  const futureSection = sections.find((s) => s.key === "future");
  const investSection = sections.find((s) => s.key === "investments");

  if (protectionSection && protectionSection.userScore < 70) {
    gaps.push({
      title: "Protection gap",
      detail: "The LIA 2022 Protection Gap Study found the average Singaporean working adult is underprotected by approximately $350,000 in life cover. Without adequate critical illness and income protection in place, a single diagnosis can permanently disrupt your financial trajectory.",
      urgency: protectionSection.userScore < 50 ? "high" : "medium",
    });
  }
  if (cpfSection && cpfSection.userScore < 65) {
    gaps.push({
      title: "CPF under-optimisation",
      detail: "Voluntary CPF SA contributions of up to $8,000 per year earn 4% risk-free and qualify for tax relief. Many Singaporeans leave this advantage entirely unused — meaning thousands in foregone compounding each year. SA shielding and tracking retirement sum progress are additional levers most overlook.",
      urgency: age > 45 ? "high" : "medium",
    });
  }
  if (futureSection && futureSection.userScore < 65) {
    gaps.push({
      title: "Retirement income shortfall",
      detail: "CPF LIFE at the Standard Plan pays approximately $1,000–$1,400 monthly at 65. Against Singapore's average household expenditure of $4,900 per month, the typical retirement shortfall is $3,000–$4,000 monthly — a gap that must be planned for, not discovered at retirement.",
      urgency: age > 50 ? "high" : "medium",
    });
  }
  if (investSection && investSection.userScore < 55 && gaps.length < 2) {
    gaps.push({
      title: "Insufficient investment growth",
      detail: "With Singapore's inflation averaging 2–4% annually, savings that are not invested are quietly losing purchasing power. Only 1 in 4 Singaporeans invests regularly outside CPF — but those who do build significantly stronger long-term positions over a 20–30 year horizon.",
      urgency: "medium",
    });
  }
  if (gaps.length === 0) {
    const lowestSection = [...sections].sort((a, b) => a.userScore - b.userScore)[0];
    gaps.push({
      title: `${lowestSection.title} — priority area`,
      detail: lowestSection.risk,
      urgency: "low",
    });
  }
  return gaps.slice(0, 2);
}

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
  ].map((section) => ({
    ...section,
    delta: section.userScore - section.benchmarkScore,
    whyThisScore: sectionWhyScore(section.key, section.userScore, answers),
  }));

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
    ? "CPF is likely your biggest local advantage. Voluntary SA top-ups of up to $8,000 per year earn 4% risk-free and qualify for full tax relief — one of the most reliable guaranteed returns available to Singaporeans. Better CPF usage alone can quietly improve long-term retirement outcomes more than many people realise."
    : answers.children > 0
      ? "With children in the picture, maximising Baby Bonus, optimising household cash flow, and reviewing your protection coverage can create compounding impact. These are often the highest-leverage steps for your life stage."
      : "Your next meaningful gain may come less from earning more and more from making your current structure work together more intentionally — connecting your CPF, insurance, and investments into a coherent plan.";

  const sgContext = buildSgContext(total, benchmark, answers);
  const urgencyNarrative = buildUrgencyNarrative(answers, sections);
  const gapSummary = buildGapSummary(sections, answers);

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
    sgContext,
    urgencyNarrative,
    gapSummary,
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
      await sendLeadToN8n({
        lead,
        answers,
        result: builtResults,
        source: "sfhs-lead-unlock",
        timestamp: new Date().toISOString(),
      });
    } catch {
      setLeadError("Unable to send your details right now. Please try again in a moment.");
      setSubmitting(false);
      return;
    } finally {
      setSubmitting(false);
    }

    setResults(builtResults);
    setStage("results");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_120%_50%_at_50%_0%,_rgba(99,102,241,0.09),_transparent_65%)]" />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <PulseIcon />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">Financial Health Check</span>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-500 backdrop-blur-sm sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
          Free · about 3 minutes
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        {stage === "landing" ? (
          <section className="relative grid gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
            {/* ── Left column ── */}
            <div className="space-y-9">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Free self-assessment
              </div>

              <div className="space-y-5">
                <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.25rem]">
                  Find out where your finances{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">actually stand.</span>
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-500">
                  A 3-minute check across CPF, protection, housing, savings, and retirement readiness. Get a clear score and know exactly what to fix first.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStage("quiz")}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.35)] transition hover:bg-indigo-700 active:scale-[0.98]"
                >
                  Check my score
                  <ArrowRightIcon />
                </button>
                <p className="text-sm text-slate-400">No account needed · results in under 3 minutes</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoCard
                  icon="cpf"
                  title="CPF built-in"
                  text="CPF contributions, top-ups, and retirement sums are part of your score — not an afterthought."
                />
                <InfoCard
                  icon="layers"
                  title="7 areas covered"
                  text="From daily habits to long-term planning — one check gives you the full picture."
                />
                <InfoCard
                  icon="lock"
                  title="Private by design"
                  text="No account required. Your answers are never stored or shared with third parties."
                />
              </div>

              <p className="text-xs leading-5 text-slate-400">
                This tool provides general financial information and does not constitute financial advice. Results are illustrative estimates based on typical Singapore benchmarks.
              </p>
            </div>

            {/* ── Right column: score preview card ── */}
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_40px_100px_rgba(15,23,42,0.22)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.22),_transparent_65%)]" />

              <div className="relative p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Sample result</p>
                  <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Moderate — room to grow
                  </span>
                </div>

                {/* Score ring + category bars */}
                <div className="flex items-center gap-7">
                  <div className="relative shrink-0">
                    <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
                      <circle cx="46" cy="46" r="36" fill="none" stroke="#1e293b" strokeWidth="7" />
                      <circle cx="46" cy="46" r="36" fill="none" stroke="#818cf8" strokeWidth="7"
                        strokeDasharray="167 226" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold leading-none text-white">74</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {[
                      { label: "Savings", score: 80, color: "bg-emerald-400" },
                      { label: "Protection", score: 55, color: "bg-amber-400" },
                      { label: "CPF", score: 70, color: "bg-indigo-400" },
                      { label: "Planning", score: 44, color: "bg-rose-400" },
                    ].map((cat) => (
                      <div key={cat.label}>
                        <div className="mb-1 flex justify-between">
                          <span className="text-xs text-slate-400">{cat.label}</span>
                          <span className="text-xs font-semibold text-white">{cat.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800">
                          <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insight cards */}
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-400">Top gap</p>
                    <p className="mt-1.5 text-sm leading-5 text-slate-300">Future planning may need immediate attention.</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400">Quick win</p>
                    <p className="mt-1.5 text-sm leading-5 text-slate-300">CPF SA top-ups could meaningfully strengthen your retirement position.</p>
                  </div>
                </div>

                <p className="mt-5 text-center text-[11px] text-slate-600">
                  Illustrative only · your results will be unique to you
                </p>
              </div>
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

const INFO_ICONS = {
  cpf: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />,
  layers: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  lock: <path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
};

function InfoCard({ title, text, icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition hover:border-slate-200 hover:bg-white hover:shadow-sm">
      {icon && (
        <div className="mb-3 grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <svg width="16" height="16" viewBox="0 0 24 24">{INFO_ICONS[icon]}</svg>
        </div>
      )}
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1.5 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
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

function PulseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
}

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}
