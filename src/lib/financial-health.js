function normaliseDependents(value) {
  if (value === "3+") return 3;
  return Number.parseInt(value || "0", 10) || 0;
}

export function calculateFinancialHealth(answers) {
  let score = 100;
  const gaps = [];
  const insights = [];

  if (answers.savingsMonths === "Less than 3 months") {
    score -= 20;
    gaps.push("Your emergency fund appears to cover less than 3 months of expenses.");
    insights.push("Your emergency buffer may not be sufficient for unexpected situations.");
  } else if (answers.savingsMonths === "3 to 6 months") {
    score -= 10;
    gaps.push("Your emergency fund may be adequate, but it could still be stretched by a longer disruption.");
    insights.push("A stronger cash buffer may give you more flexibility during a prolonged setback.");
  }

  if (answers.hospitalCoverage === "No") {
    score -= 25;
    gaps.push("You may be exposed to large hospital or treatment costs.");
  } else if (answers.hospitalCoverage === "Unsure") {
    score -= 15;
    gaps.push("You are not fully clear on your hospital coverage, which can leave blind spots.");
    insights.push("Not being sure about your hospital cover may create costly surprises when you need care most.");
  }

  if (answers.incomeProtection === "No") {
    score -= 25;
    gaps.push("There may be no plan in place to support your income if you cannot work.");
    insights.push("Your current setup may not support you if your income is disrupted.");
  } else if (answers.incomeProtection === "Partial") {
    score -= 10;
    gaps.push("Your income protection may only cover part of a major income interruption.");
    insights.push("Partial protection may still leave you with a significant income shortfall.");
  }

  const dependents = normaliseDependents(answers.dependents);
  if (dependents > 0) {
    insights.push("With dependents relying on you, financial gaps may have a larger impact.");
  }

  if (dependents > 0 && answers.incomeProtection === "No") {
    score -= 15;
    gaps.push("You have dependents but no clear income protection safety net.");
  }

  if (answers.financialConcern === "Hospital and medical costs") {
    insights.push("Medical cost concerns often point to a need for clearer protection planning.");
  }

  if (answers.financialConcern === "Paying bills if income stops") {
    insights.push("Cash flow resilience is a key focus area if a temporary income loss would affect your bills quickly.");
  }

  if (
    answers.planningConfidence === "Not very confident" ||
    answers.planningConfidence === "Not confident at all"
  ) {
    insights.push("Low confidence in your safety net is often a signal that important protections may still need attention.");
  }

  score = Math.max(0, score);

  let riskLabel = "Low Risk";
  let riskTone = "emerald";

  if (score < 50) {
    riskLabel = "High Risk";
    riskTone = "rose";
  } else if (score < 80) {
    riskLabel = "Moderate Risk";
    riskTone = "amber";
  }

  return {
    score,
    riskLabel,
    riskTone,
    gaps,
    insights: Array.from(new Set(insights)),
    recommendations: [
      "Review whether your cash reserve can cover core expenses for at least 6 months.",
      "Confirm what your hospital and medical coverage actually includes.",
      "Assess whether your income would continue if illness or injury stopped you from working.",
    ],
  };
}
