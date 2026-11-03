import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoraos.company";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AUTORA OS | Revenue Execution Infrastructure", template: "%s | AUTORA OS" },
  description: "Revenue execution infrastructure for automotive dealership operations.",
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return <html lang="en-ZA"><body className="antialiased">{ga ? <><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script></> : null}<SiteHeader/><main>{children}</main><SiteFooter/></body></html>;
}
