import type { Metadata } from "next";
import { HomeAudiV2 } from "@/components/pages/home-audi-v2";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Revenue discipline for dealership leads",
  description:
    "Detect slow responses, missed follow-ups, and booking gaps across WhatsApp, website, ads, and OEM leads with AUTORA OS.",
  path: "/"
});

export default function HomePage() {
  return <HomeAudiV2 />;
}
