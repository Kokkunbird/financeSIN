import LifeStagePage from "@/components/LifeStagePage";

export const metadata = {
  title: "First Job Financial Check — Singapore",
  description: "A free financial check for young working adults in Singapore — covering emergency funds, CPF, MediShield, and the habits that compound over time.",
};

export default function FirstJobPage() {
  return (
    <LifeStagePage
      eyebrow="For young working adults in Singapore"
      headline={
        <>
          First payslip.{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Now what?
          </span>
        </>
      }
      sub="A free 3-minute check covering emergency savings, CPF awareness, protection basics, and the money habits that quietly separate the financially secure from everyone else — 10 years from now."
      ctaLabel="Check my starting position"
      ls="first-job"
      accentColor="emerald"
      checklist={[
        "Do you have even one month of expenses saved as a buffer?",
        "Do you know what your CPF contributions are actually going toward?",
        "Are you covered if you end up in hospital unexpectedly?",
        "Could you survive financially if your income stopped for 3 months?",
      ]}
      cards={[
        {
          icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
          title: "The emergency fund foundation",
          text: "MAS recommends 6 months of expenses before investing. At Singapore's average cost of living, that is roughly $15,000–$30,000. Starting this habit early is the single highest-impact financial move in your 20s.",
        },
        {
          icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
          title: "CPF SA — the compounding head start",
          text: "Your Special Account earns 4% annually, tax-free. Starting voluntary top-ups of even $50–$100/month in your 20s builds a retirement cushion that takes decades to replicate if you start at 45.",
        },
        {
          icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>,
          title: "Protection before life gets complicated",
          text: "Term life and critical illness cover is significantly cheaper in your 20s than at 35. Getting covered early — before a health event makes you uninsurable — is one of the most cost-effective decisions you can make now.",
        },
      ]}
    />
  );
}
