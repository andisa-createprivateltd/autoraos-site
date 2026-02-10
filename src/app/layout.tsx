import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { PARENT_COMPANY_NAME, PLATFORM_NAME, PLATFORM_SUBSIDIARY_LINE } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoraos.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PLATFORM_NAME} | WhatsApp + Lead Infrastructure`,
    template: `%s | ${PLATFORM_NAME}`
  },
  description:
    `${PLATFORM_NAME} is the operating system for dealership leads and WhatsApp sales. ${PLATFORM_SUBSIDIARY_LINE}.`,
  keywords: [
    PLATFORM_NAME,
    "AUTORA OS",
    "Dealership WhatsApp platform",
    "Automotive lead operating system",
    "Test-drive booking software",
    PARENT_COMPANY_NAME
  ],
  openGraph: {
    title: PLATFORM_NAME,
    description: `The operating system for dealership leads and WhatsApp sales. ${PLATFORM_SUBSIDIARY_LINE}.`,
    url: siteUrl,
    siteName: PLATFORM_NAME,
    locale: "en_ZA",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en-ZA">
      <body className="text-coal antialiased">
        {gaMeasurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}

        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
