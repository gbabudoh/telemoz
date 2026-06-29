import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Telemoz - Professional Digital Marketing Platform",
  description: "The All-in-One Professional Hub for Digital Marketing Success and Seamless Client-Agency Collaboration",
  keywords: "digital marketing, SEO, PPC, social media marketing, marketing automation, marketing agencies, hire marketing pros",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logos/logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://telemoz.com",
    title: "Telemoz - Professional Digital Marketing Platform",
    description: "The All-in-One Professional Hub for Digital Marketing Success and Seamless Client-Agency Collaboration",
    siteName: "Telemoz",
    images: [
      {
        url: "https://telemoz.com/logos/logo.png",
        width: 120,
        height: 40,
        alt: "Telemoz Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telemoz - Professional Digital Marketing Platform",
    description: "The All-in-One Professional Hub for Digital Marketing Success and Seamless Client-Agency Collaboration",
    images: ["https://telemoz.com/logos/logo.png"],
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "London",
    "geo.position": "51.514757;-0.124239",
    "ICBM": "51.514757, -0.124239",
  },
};

export const viewport = {
  themeColor: "#0a9396",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
  const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xen8n8lyv4");
          `}
        </Script>
        {matomoUrl && matomoSiteId && (
          <Script id="matomo-analytics" strategy="afterInteractive">
            {`
              var _paq = window._paq = window._paq || [];
              /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="${matomoUrl}";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${matomoSiteId}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `}
          </Script>
        )}
        <SessionProvider>
          <JsonLd />
          {children}
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
