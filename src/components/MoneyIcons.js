/**
 * MoneyIcons — friendly illustrated SVG components for financial categories.
 * All icons are self-contained SVG, no external dependencies.
 */

/* ── Category icons ──────────────────────────────────────────────────────── */

export function StabilityIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Green wallet */}
      <rect x="3" y="8" width="22" height="15" rx="3" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
      <path d="M3 12h22" stroke="#10B981" strokeWidth="1.5" />
      {/* Coin slot */}
      <rect x="17" y="14.5" width="6" height="5" rx="2" fill="#10B981" opacity="0.3" />
      <circle cx="20" cy="17" r="1.5" fill="#10B981" />
      {/* Stacked coins peeking from top */}
      <ellipse cx="9" cy="8.5" rx="4" ry="1.5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
      <ellipse cx="9" cy="7" rx="4" ry="1.5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
    </svg>
  );
}

export function CpfIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Blue circular CPF badge */}
      <circle cx="14" cy="14" r="11" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="7.5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
      {/* Dollar sign */}
      <path d="M14 9v1m0 8v1" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 12.5c0-.83.9-1.5 2.5-1.5s2.5.67 2.5 1.5S15.1 14 14 14.5c-1.6.5-2.5 1.17-2.5 2 0 .83.9 1.5 2.5 1.5s2.5-.67 2.5-1.5"
        stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ProtectionIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Rose shield */}
      <path d="M14 3L5 7v6c0 5.25 3.85 10.15 9 11.35C19.15 23.15 23 18.25 23 13V7L14 3z"
        fill="#FFE4E6" stroke="#F43F5E" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Checkmark */}
      <path d="M10 14l2.5 2.5L18 11" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HousingIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Teal house */}
      <path d="M4 13.5L14 5l10 8.5" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="13.5" width="16" height="10" rx="1.5" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
      {/* Door */}
      <rect x="11.5" y="18" width="5" height="5.5" rx="1" fill="#0D9488" opacity="0.4" />
      {/* Window */}
      <rect x="7" y="15.5" width="4" height="3.5" rx="0.75" fill="#0D9488" opacity="0.35" />
      {/* Roof chimney */}
      <rect x="18" y="8" width="2.5" height="4" rx="0.5" fill="#0D9488" opacity="0.4" />
    </svg>
  );
}

export function InvestmentIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Indigo chart */}
      <rect x="3" y="3" width="22" height="22" rx="5" fill="#EEF2FF" />
      {/* Bars */}
      <rect x="6" y="16" width="4" height="7" rx="1" fill="#818CF8" />
      <rect x="12" y="11" width="4" height="12" rx="1" fill="#6366F1" />
      <rect x="18" y="7" width="4" height="16" rx="1" fill="#4F46E5" />
      {/* Trend arrow */}
      <path d="M6 15l5-5 4 3 6-6" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 7h4v4" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HabitsIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Amber wallet/purse */}
      <rect x="3" y="9" width="22" height="15" rx="3.5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M3 13.5h22" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M17 9V7a4 4 0 00-8 0v2" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      {/* Coins inside */}
      <circle cx="10" cy="18.5" r="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="16" cy="18.5" r="2" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
    </svg>
  );
}

export function FutureIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Violet calendar */}
      <rect x="3" y="5" width="22" height="20" rx="3.5" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M3 11h22" stroke="#7C3AED" strokeWidth="1.5" />
      <rect x="8" y="3" width="3" height="5" rx="1.5" fill="#7C3AED" />
      <rect x="17" y="3" width="3" height="5" rx="1.5" fill="#7C3AED" />
      {/* Star */}
      <path d="M14 14.5l1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z"
        fill="#7C3AED" opacity="0.8" />
    </svg>
  );
}

export function ProfileIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="5.5" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
      <path d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Decorative landing graphics ─────────────────────────────────────────── */

/** Big illustrative coin — used as background decoration */
export function DecorCoin({ size = 64, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="30" fill="#FEF9C3" stroke="#FCD34D" strokeWidth="2" />
      <circle cx="32" cy="32" r="24" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M32 18v3m0 22v3M25 27c0-2.76 3.13-5 7-5s7 2.24 7 5-3.13 4-7 5c-3.87 1-7 3.1-7 5.86C25 40.72 28.13 43 32 43s7-2.24 7-4.86"
        stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Rising bar chart — used as background decoration */
export function DecorChart({ size = 56, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={className}>
      <rect x="4" y="4" width="48" height="48" rx="12" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
      <rect x="10" y="34" width="8" height="12" rx="2" fill="#A5B4FC" />
      <rect x="24" y="24" width="8" height="22" rx="2" fill="#818CF8" />
      <rect x="38" y="14" width="8" height="32" rx="2" fill="#6366F1" />
      <path d="M10 28l10-10 9 7 11-13" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Shield — used as background decoration */
export function DecorShield({ size = 52, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" className={className}>
      <path d="M26 4L8 12v11c0 9.8 7.7 19.3 18 21.7C36.3 42.3 44 32.8 44 23V12L26 4z"
        fill="#FFE4E6" stroke="#FB7185" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 26l5 5 11-11" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Plant growing from coin — investments/growth decoration */
export function DecorPlant({ size = 60, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      {/* Coin */}
      <ellipse cx="30" cy="48" rx="14" ry="5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
      <ellipse cx="30" cy="44" rx="14" ry="5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      {/* Stem */}
      <path d="M30 44v-22" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M30 30c0 0-8-2-10-10 4 0 10 3 10 10z" fill="#6EE7B7" stroke="#10B981" strokeWidth="1" />
      <path d="M30 24c0 0 8-2 10-10-4 0-10 3-10 10z" fill="#34D399" stroke="#10B981" strokeWidth="1" />
      {/* Top leaf */}
      <path d="M30 18c0 0-5-3-5-10 3 1 5 5 5 10z" fill="#6EE7B7" stroke="#10B981" strokeWidth="1" />
    </svg>
  );
}

/** House — decoration for housing section */
export function DecorHouse({ size = 56, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={className}>
      <path d="M8 27L28 10l20 17" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10" y="27" width="36" height="22" rx="2.5" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2" />
      <rect x="23" y="36" width="10" height="13" rx="1.5" fill="#0D9488" opacity="0.35" />
      <rect x="14" y="31" width="8" height="7" rx="1.5" fill="#0D9488" opacity="0.3" />
      <rect x="34" y="31" width="8" height="7" rx="1.5" fill="#0D9488" opacity="0.3" />
      <rect x="35" y="16" width="5" height="8" rx="1" fill="#0D9488" opacity="0.4" />
    </svg>
  );
}

/* ── Category → icon map (used in quiz & results) ────────────────────────── */

export const CATEGORY_ICON = {
  "Profile":              <ProfileIcon />,
  "Financial stability":  <StabilityIcon />,
  "CPF and government":   <CpfIcon />,
  "Protection":           <ProtectionIcon />,
  "Housing":              <HousingIcon />,
  "Investments":          <InvestmentIcon />,
  "Money habits":         <HabitsIcon />,
  "Future planning":      <FutureIcon />,
};

export const SECTION_ICON = {
  stability:   <StabilityIcon />,
  cpf:         <CpfIcon />,
  protection:  <ProtectionIcon />,
  housing:     <HousingIcon />,
  investments: <InvestmentIcon />,
  habits:      <HabitsIcon />,
  future:      <FutureIcon />,
};
