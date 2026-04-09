"use client";

import React, { useState, useMemo } from "react";

const SG_AVERAGES = {
  total: 67,
  savings: 71,
  debt: 68,
  protection: 75,
  planning: 62,
};

function calculateSGResult(answers) {
  const scores = {
    savings: Math.min(100, Math.max(0, (answers.emergency + 1) * 25)),
    debt: Math.min(100, Math.max(0, (answers.debt + 1) * 25)),
    protection: Math.min(100, Math.max(0, (answers.insurance + 1) * 25)),
    planning: Math.min(100, Math.max(0, (answers.retirement + 1) * 25)),
  };
  const total = Math.round(
    (scores.savings + scores.debt + scores.protection + scores.planning) / 4
  );
  const status =
    total > 70 ? "Stable" : total > 50 ? "Stable but exposed" : "Vulnerable";
  return { total, scores, status };
}

const NAV_ITEMS = ["SFHI score", "Benchmark", "Protection", "Planning"];

const INSIGHTS = [
  {
    key: "savings",
    label: "Savings health",
    avgKey: "savings",
    note: "Your emergency buffer exists, but may be thinner than recommended.",
  },
  {
    key: "debt",
    label: "Debt health",
    avgKey: "debt",
    note: "Repayment is comfortable. Optimisation could increase your monthly surplus.",
    positive: true,
  },
  {
    key: "protection",
    label: "Protection health",
    avgKey: "protection",
    note: "Potential gap detected in the 9× income protection benchmark.",
  },
  {
    key: "planning",
    label: "Planning health",
    avgKey: "planning",
    note: "Planning momentum exists, but your long-term roadmap may need clearer structure.",
  },
];

export default function Results({ answers, onRestart }) {
  const [view, setView] = useState("dashboard");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const result = useMemo(() => calculateSGResult(answers), [answers]);
  const scoreDelta = result.total - SG_AVERAGES.total;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) return;
    setSubmitting(true);
    setView("success");
    try {
      await fetch(
        "https://khainelo.app.n8n.cloud/webhook/Meridian-Assestment-Lead",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            score: result.total,
            breakdown: result.scores,
            status: result.status,
            timestamp: new Date().toISOString(),
          }),
        }
      );
    } catch (err) {
      console.error("Webhook error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (view === "success") return <SuccessView onRestart={onRestart} />;

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        {/* ── Top bar ── */}
        <header style={styles.topBar}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>M</div>
            <span style={styles.brandName}>Meridian Advisory</span>
          </div>
          <span style={styles.badge}>
            Aligned with Singapore financial guidelines
          </span>
        </header>

        {/* ── 3-column layout ── */}
        <div style={styles.layout}>
          {/* LEFT NAV */}
          <aside style={styles.sidebarLeft}>
            <div style={styles.logoBlock}>
              <div style={styles.rfIcon}>RF</div>
              <div>
                <div style={styles.rfLabel}>SFHI Results</div>
                <div style={styles.rfSub}>2026 assessment</div>
              </div>
            </div>

            <StatusPill status={result.status} />

            <nav style={styles.nav}>
              <div style={styles.sectionLabel}>Navigation</div>
              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item}
                  style={{
                    ...styles.navItem,
                    ...(i === 0 ? styles.navItemActive : {}),
                  }}
                >
                  <span>{item}</span>
                  <div
                    style={{
                      ...styles.navDot,
                      ...(i === 0 ? styles.navDotActive : {}),
                    }}
                  />
                </div>
              ))}
            </nav>

            <div style={styles.impactNote}>
              <div style={styles.sectionLabel}>Impact note</div>
              <p style={styles.impactText}>
                Without proper planning, these gaps may affect your ability to
                handle unexpected events or achieve long-term stability.
              </p>
            </div>
          </aside>

          {/* MAIN */}
          <main style={styles.main}>
            {/* Score row */}
            <div style={styles.twoCol}>
              <div style={styles.card}>
                <div style={styles.sectionLabel}>Your SFHI score</div>
                <div style={styles.scoreCircle}>{result.total}</div>
                <div style={styles.scoreDelta}>
                  {Math.abs(scoreDelta)} points{" "}
                  {scoreDelta < 0 ? "below" : "above"} Singapore average (
                  {SG_AVERAGES.total})
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.sectionLabel}>Reality trigger</div>
                <p style={styles.realityText}>
                  "Debt pressure may reduce your ability to recover quickly from
                  a financial shock. These gaps are common, but delaying action
                  increases risk."
                </p>
              </div>
            </div>

            <div style={styles.divider} />

            {/* Insights */}
            <div>
              <div style={styles.sectionLabel}>
                Key insights vs Singapore average
              </div>
              <div style={styles.insightList}>
                {INSIGHTS.map(({ key, label, avgKey, note, positive }) => {
                  const you = result.scores[key];
                  const avg = SG_AVERAGES[avgKey];
                  const isPositive = positive || you >= avg;
                  return (
                    <InsightRow
                      key={key}
                      label={label}
                      you={you}
                      avg={avg}
                      note={note}
                      positive={isPositive}
                    />
                  );
                })}
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside style={styles.sidebarRight}>
            <div style={styles.sectionLabel}>Participant</div>
            <div style={styles.profileRow}>
              <div style={styles.avatar}>K</div>
              <div>
                <div style={styles.profileName}>Khairul Harisin</div>
                <div style={styles.profileSub}>SFHI participant</div>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statNum}>{result.total}</div>
                <div style={styles.statLbl}>Your score</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNum}>{SG_AVERAGES.total}</div>
                <div style={styles.statLbl}>SG average</div>
              </div>
            </div>

            <div style={styles.divider} />

            {/* CTA */}
            {view === "dashboard" ? (
              <div style={styles.ctaBlock}>
                <div style={styles.ctaTitle}>
                  Get a personalised strategy to improve your financial position
                </div>
                <p style={styles.ctaBody}>
                  A specialist will review your results and build a tailored
                  roadmap aligned with MAS guidelines.
                </p>
                <button
                  style={styles.ctaBtn}
                  onClick={() => setView("form")}
                >
                  Get my personal plan
                </button>
                <div style={styles.ctaNote}>No obligation · confidential</div>
              </div>
            ) : (
              /* Inline form in sidebar */
              <form onSubmit={handleSubmit} style={styles.inlineForm}>
                <div style={styles.formTitle}>Finalise your review</div>
                <p style={styles.formSub}>
                  A specialist will reach out via WhatsApp.
                </p>
                <input
                  style={styles.input}
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
                <input
                  style={styles.input}
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
                <input
                  style={styles.input}
                  placeholder="WhatsApp number"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  required
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    style={styles.backBtn}
                    onClick={() => setView("dashboard")}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    style={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Initialise review"}
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatusPill({ status }) {
  return (
    <span style={styles.statusPill}>{status}</span>
  );
}

function InsightRow({ label, you, avg, note, positive }) {
  return (
    <div style={styles.insightRow}>
      <div style={styles.insightHeader}>
        <span style={styles.insightLabel}>{label}</span>
        <span style={styles.insightScores}>
          SG avg: {avg}&nbsp;&nbsp;|&nbsp;&nbsp;
          <span
            style={{
              color: positive ? "#27500A" : "#534AB7",
              fontWeight: 500,
            }}
          >
            You: {you}
          </span>
        </span>
      </div>
      <div style={styles.progressBg}>
        <div
          style={{
            ...styles.progressFill,
            width: `${you}%`,
            background: positive ? "#3B6D11" : "#534AB7",
          }}
        />
      </div>
      <div style={styles.insightNote}>{note}</div>
    </div>
  );
}

function SuccessView({ onRestart }) {
  return (
    <div style={styles.successPage}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>
          <svg
            width={28}
            height={28}
            fill="none"
            viewBox="0 0 24 24"
            stroke="#3B6D11"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div style={styles.successTitle}>Specialist assigned</div>
        <p style={styles.successBody}>
          We've received your details. A specialist will contact you via
          WhatsApp to finalise your strategy.
        </p>
        <button style={styles.submitBtn} onClick={onRestart}>
          Return to dashboard
        </button>
      </div>
    </div>
  );
}

/* ── Styles ── */

const PURPLE = "#534AB7";
const PURPLE_DARK = "#3C3489";
const PURPLE_LIGHT = "#EEEDFE";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F7F5",
    padding: "24px",
    fontFamily:
      "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    maxWidth: 1100,
    background: "#fff",
    border: "0.5px solid #E0DED8",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    borderBottom: "0.5px solid #E0DED8",
    background: "#FAFAF8",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandIcon: {
    width: 28, height: 28, borderRadius: 6,
    background: PURPLE, display: "flex",
    alignItems: "center", justifyContent: "center",
    color: PURPLE_LIGHT, fontWeight: 600, fontSize: 12,
  },
  brandName: { fontSize: 13, fontWeight: 500, color: "#1A1A18" },
  badge: {
    fontSize: 11, padding: "4px 12px",
    borderRadius: 20, background: "#EEF1FB",
    color: "#3A3AA0", fontWeight: 500,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "200px 1fr 220px",
    minHeight: 580,
  },
  sidebarLeft: {
    borderRight: "0.5px solid #E0DED8",
    padding: "24px 16px",
    display: "flex", flexDirection: "column", gap: 20,
    background: "#FAFAF8",
  },
  logoBlock: { display: "flex", alignItems: "center", gap: 10 },
  rfIcon: {
    width: 34, height: 34, borderRadius: 8,
    background: PURPLE, display: "flex",
    alignItems: "center", justifyContent: "center",
    color: PURPLE_LIGHT, fontWeight: 600, fontSize: 12,
  },
  rfLabel: { fontSize: 12, fontWeight: 600, color: "#1A1A18", lineHeight: 1.3 },
  rfSub: { fontSize: 11, color: "#888784" },
  statusPill: {
    display: "inline-block", padding: "3px 10px",
    borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: PURPLE_LIGHT, color: PURPLE_DARK,
  },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  navItem: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 10px", borderRadius: 8, fontSize: 12,
    cursor: "pointer", color: "#888784",
  },
  navItemActive: {
    background: PURPLE_LIGHT, color: PURPLE_DARK, fontWeight: 600,
  },
  navDot: { width: 6, height: 6, borderRadius: "50%", background: "#D3D1C7" },
  navDotActive: { background: PURPLE },
  impactNote: {
    marginTop: "auto",
    background: "#F3F2FE", border: "0.5px solid #CECBF6",
    borderRadius: 10, padding: 14,
  },
  impactText: { fontSize: 12, color: "#5F5D8A", lineHeight: 1.6, marginTop: 6 },
  sectionLabel: {
    fontSize: 11, color: "#888784", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
  },
  main: {
    padding: 24,
    display: "flex", flexDirection: "column", gap: 20,
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  card: {
    background: "#fff", border: "0.5px solid #E0DED8",
    borderRadius: 12, padding: 16,
  },
  scoreCircle: {
    width: 64, height: 64, borderRadius: "50%",
    border: `3px solid ${PURPLE}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 24, fontWeight: 600, color: "#1A1A18",
    margin: "12px 0",
  },
  scoreDelta: { fontSize: 12, color: "#888784", lineHeight: 1.5 },
  realityText: {
    fontSize: 13, color: "#5A5856",
    lineHeight: 1.65, fontStyle: "italic", marginTop: 10,
  },
  divider: { height: 1, background: "#E0DED8" },
  insightList: { display: "flex", flexDirection: "column", gap: 16 },
  insightRow: { display: "flex", flexDirection: "column", gap: 6 },
  insightHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
  },
  insightLabel: { fontSize: 13, fontWeight: 600, color: "#1A1A18" },
  insightScores: { fontSize: 12, color: "#888784" },
  progressBg: {
    height: 4, background: "#E0DED8", borderRadius: 2, overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2, transition: "width 0.4s ease" },
  insightNote: { fontSize: 12, color: "#888784", lineHeight: 1.5 },
  sidebarRight: {
    borderLeft: "0.5px solid #E0DED8",
    padding: "24px 16px",
    display: "flex", flexDirection: "column", gap: 14,
    background: "#FAFAF8",
  },
  profileRow: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: PURPLE, display: "flex",
    alignItems: "center", justifyContent: "center",
    color: PURPLE_LIGHT, fontWeight: 600, fontSize: 14,
  },
  profileName: { fontSize: 13, fontWeight: 600, color: "#1A1A18" },
  profileSub: { fontSize: 11, color: "#888784" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  statBox: {
    background: "#fff", border: "0.5px solid #E0DED8",
    borderRadius: 10, padding: "10px 12px", textAlign: "center",
  },
  statNum: { fontSize: 20, fontWeight: 600, color: "#1A1A18" },
  statLbl: {
    fontSize: 10, color: "#888784",
    textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2,
  },
  ctaBlock: {
    background: PURPLE_DARK, borderRadius: 12, padding: 18,
    display: "flex", flexDirection: "column", gap: 10,
  },
  ctaTitle: { fontSize: 13, fontWeight: 600, color: PURPLE_LIGHT, lineHeight: 1.45 },
  ctaBody: { fontSize: 12, color: "#AFA9EC", lineHeight: 1.55 },
  ctaBtn: {
    width: "100%", padding: "10px 0",
    background: PURPLE_LIGHT, color: PURPLE_DARK,
    border: "none", borderRadius: 8,
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  ctaNote: { fontSize: 10, color: "#7F77DD", textAlign: "center" },
  inlineForm: { display: "flex", flexDirection: "column", gap: 10 },
  formTitle: { fontSize: 14, fontWeight: 600, color: "#1A1A18" },
  formSub: { fontSize: 12, color: "#888784", lineHeight: 1.5 },
  input: {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #D3D1C7", borderRadius: 8,
    fontSize: 12, background: "#fff", color: "#1A1A18",
    outline: "none",
  },
  backBtn: {
    flex: 1, padding: "9px 0",
    background: "#F3F2EE", border: "0.5px solid #D3D1C7",
    borderRadius: 8, fontSize: 12, fontWeight: 500,
    color: "#5A5856", cursor: "pointer",
  },
  submitBtn: {
    flex: 2, padding: "10px 0",
    background: PURPLE_DARK, border: "none",
    borderRadius: 8, fontSize: 12, fontWeight: 600,
    color: PURPLE_LIGHT, cursor: "pointer",
  },
  successPage: {
    minHeight: "100vh", background: "#F7F7F5",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24, fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  },
  successCard: {
    background: "#fff", border: "0.5px solid #E0DED8",
    borderRadius: 16, padding: "40px 32px",
    maxWidth: 380, width: "100%",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 14, textAlign: "center",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  },
  successIcon: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#EAF3DE", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  successTitle: { fontSize: 18, fontWeight: 600, color: "#1A1A18" },
  successBody: { fontSize: 13, color: "#5A5856", lineHeight: 1.65 },
};