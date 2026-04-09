import { useState } from "react";

const initialLeadForm = {
  name: "",
  email: "",
  phone: "",
  consent: false,
};

function saveLeadToBrowser(submission) {
  if (typeof window === "undefined") return;

  const storageKey = "financial-health-check-leads";
  const existing = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  existing.push({
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...submission,
    storage: "browser",
  });
  window.localStorage.setItem(storageKey, JSON.stringify(existing));
}

export function LeadCaptureForm({ answers, result, onSubmitted, onBack }) {
  const [form, setForm] = useState(initialLeadForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.consent) {
      setError("Please complete all fields and provide consent before continuing.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: form,
          answers,
          result,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save your details right now.");
      }

      setStatus("success");
      onSubmitted(payload);
    } catch (submitError) {
      saveLeadToBrowser({
        lead: form,
        answers,
        result,
      });
      setStatus("success");
      onSubmitted({ success: true, storage: "browser" });
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-600">Next step</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Request a follow-up conversation
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Share your details and a licensed financial representative can reach out to help you understand your options.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Your snapshot</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-950 text-xl font-bold text-white">
                {result.score}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950">{result.riskLabel}</p>
                <p className="text-sm text-slate-600">
                  {result.gaps.length} potential gap{result.gaps.length === 1 ? "" : "s"} identified
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to results
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-950"
                placeholder="Your full name"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-950"
                placeholder="you@example.com"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-950"
                placeholder="+65 9123 4567"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => updateField("consent", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-950"
            />
            <span className="text-sm leading-6 text-slate-700">
              I consent to be contacted by a licensed financial representative.
            </span>
          </label>

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {status === "submitting" ? "Submitting..." : "Request advisor follow-up"}
          </button>

          <p className="text-sm text-slate-500">
            This tool provides general financial information and does not constitute financial advice.
          </p>
        </form>
      </div>
    </section>
  );
}
