import LifeStagePage from "@/components/LifeStagePage";

export const metadata = {
  title: "New Parent Financial Check — Singapore",
  description: "A free check covering income protection, Baby Bonus, life cover, and mortgage protection for new parents in Singapore.",
};

export default function NewParentPage() {
  return (
    <LifeStagePage
      eyebrow="For new parents in Singapore"
      headline={
        <>
          A new child changes everything.{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Is your safety net keeping up?
          </span>
        </>
      }
      sub="A free 3-minute check covering income protection, life cover, Baby Bonus, and mortgage coverage — the four things new parents most commonly overlook."
      ctaLabel="Check my family's financial health"
      ls="new-parent"
      accentColor="violet"
      checklist={[
        "If one income stopped tomorrow, how long could your household manage?",
        "Does your life cover reflect your mortgage and your child's dependency?",
        "Are you maximising Baby Bonus and the CDA co-matching scheme?",
        "Is your hospitalisation cover still adequate now that your family has grown?",
      ]}
      cards={[
        {
          icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>,
          title: "Income protection gap",
          text: "3 in 4 Singaporeans lack adequate disability income coverage (LIA 2022). If illness or injury stopped you from working, your family's expenses don't pause.",
        },
        {
          icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
          title: "Life cover adequacy",
          text: "The LIA benchmark is 9–10× your annual income. With a new dependent, your cover should be reviewed to reflect the mortgage, childcare costs, and long-term support.",
        },
        {
          icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
          title: "Baby Bonus — are you getting all of it?",
          text: "The Baby Bonus scheme includes cash gifts and dollar-for-dollar CDA co-matching of up to $3,000–$6,000 depending on birth order. Many parents leave co-matching unclaimed.",
        },
      ]}
    />
  );
}
