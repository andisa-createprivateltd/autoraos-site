import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export const metadata: Metadata = {
  metadataBase: new URL("https://createprivateltd.co.za"),
  title: {
    default: "CreatePrivate Dealer OS | WhatsApp + Lead Infrastructure",
    template: "%s | CreatePrivate Dealer OS"
  },
  description:
    "CreatePrivate Dealer OS is the operating system for dealership leads and WhatsApp sales. Respond faster, book more test drives, and improve conversion.",
  keywords: [
    "Dealer OS",
    "Dealership WhatsApp platform",
    "Automotive lead operating system",
    "Test-drive booking software",
    "CreatePrivate"
  ],
  openGraph: {
    title: "CreatePrivate Dealer OS",
    description: "The operating system for dealership leads and WhatsApp sales.",
    url: "https://createprivateltd.co.za",
    siteName: "CreatePrivate Dealer OS",
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
        <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
