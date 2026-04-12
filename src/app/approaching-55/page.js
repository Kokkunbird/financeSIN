import LifeStagePage from "@/components/LifeStagePage";

export const metadata = {
  title: "CPF Retirement Readiness Check — Singapore",
  description: "A free check for Singaporeans approaching 55 — covering CPF retirement sum progress, CPF LIFE options, and retirement income gaps.",
};

export default function Approaching55Page() {
  return (
    <LifeStagePage
      eyebrow="For Singaporeans approaching 55"
      headline={
        <>
          CPF at 55.{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Are you actually on track?
          </span>
        </>
      }
      sub="A free 3-minute check covering your CPF retirement sum progress, CPF LIFE plan options, and whether your projected income at 65 will cover what life actually costs in Singapore."
      ctaLabel="Check my retirement readiness"
      ls="approaching-55"
      accentColor="indigo"
      checklist={[
        "Are you on track for the Full Retirement Sum ($205,800 in 2025)?",
        "Do you know which CPF LIFE plan suits your drawdown needs?",
        "What is your projected monthly payout at 65 — and is it enough?",
        "Is your investment portfolio positioned for a 20+ year retirement horizon?",
      ]}
      cards={[
        {
          icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
          title: "The CPF retirement sum gap",
          text: "CPF LIFE at the Standard Plan pays roughly $1,000–$1,400/month at 65. Singapore's average household spends ~$4,900/month. That is a $3,000–$4,000 monthly gap that needs a plan — not a hope.",
        },
        {
          icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
          title: "CPF LIFE — Basic, Standard, or Escalating?",
          text: "The plan you choose at 65 is irreversible and affects every payment for the rest of your life. Most Singaporeans pick without understanding the trade-offs between payout level and bequest.",
        },
        {
          icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
          title: "Investment drawdown risk",
          text: "With a 20+ year retirement horizon (Singapore's average life expectancy is 83–85), a portfolio that is too conservative at 55 risks being outpaced by inflation well before age 80.",
        },
      ]}
    />
  );
}
