import { ProgressBar } from "@/components/financial-health/progress-bar";

export function QuizForm({
  currentQuestion,
  currentStep,
  totalSteps,
  answers,
  onAnswer,
  onBack,
  onNext,
}) {
  const currentValue = answers[currentQuestion.id];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="space-y-8">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-600">Financial health quiz</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {currentQuestion.title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600">{currentQuestion.description}</p>
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => {
            const selected = currentValue === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onAnswer(currentQuestion.id, option)}
                className={`rounded-3xl border px-5 py-4 text-left text-base font-medium transition ${
                  selected
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                    : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!currentValue}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {currentStep === totalSteps - 1 ? "See my result" : "Continue"}
          </button>
        </div>

        <p className="text-sm text-slate-500">
          This tool provides general financial information and does not constitute financial advice.
        </p>
      </div>
    </section>
  );
}
