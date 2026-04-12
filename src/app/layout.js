import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Financial Health Check — Singapore",
  description: "A free 3-minute self-assessment covering CPF, protection, housing, savings, and retirement readiness. Get a clear score and know what to fix first.",
  openGraph: {
    title: "Financial Health Check — Singapore",
    description: "Find out where your finances actually stand. Free, private, CPF-aware.",
    type: "website",
  },
};

// ─── Replace these with your real IDs before going live ───────────────────────
const META_PIXEL_ID = "YOUR_META_PIXEL_ID";   // e.g. "1234567890123456"
const GTM_ID = "YOUR_GTM_ID";                 // e.g. "GTM-XXXXXXX"
// ──────────────────────────────────────────────────────────────────────────────

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* ── Google Tag Manager ── */}
        {GTM_ID !== "YOUR_GTM_ID" && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* ── Meta Pixel ── */}
        {META_PIXEL_ID !== "YOUR_META_PIXEL_ID" && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');`}
          </Script>
        )}
      </head>

      <body>
        {/* ── GTM noscript fallback ── */}
        {GTM_ID !== "YOUR_GTM_ID" && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {children}
      </body>
    </html>
  );
}
