import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoraos.company";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AUTORA OS | Revenue Discipline for Dealership Leads",
    template: "%s | AUTORA OS"
  },
  description:
    "AUTORA OS is the WhatsApp-first operating system for dealership leads: capture every enquiry, enforce response SLAs, protect bookings, and measure revenue risk across stores.",
  keywords: [
    "AUTORA OS",
    "dealership lead operations",
    "WhatsApp dealership software",
    "SLA enforcement for dealerships",
    "dealer group revenue governance",
    "automotive retail operating system"
  ],
  openGraph: {
    title: "AUTORA OS",
    description:
      "Revenue discipline for dealership leads and WhatsApp conversations.",
    url: siteUrl,
    siteName: "AUTORA OS",
    locale: "en_ZA",
    type: "website"
  },
  icons: {
    icon: "/autora-mark.svg",
    shortcut: "/autora-mark.svg",
    apple: "/autora-mark.svg"
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
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
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
