export function ProgressBar({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Step {currentStep + 1}</span>
        <span>{totalSteps} questions</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
