import type { Metadata } from "next";
import { HomeAudiV2 } from "@/components/pages/home-audi-v2";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Revenue Control Infrastructure for Dealership Networks",
  description: "AUTORA OS governs response discipline, booking execution, and revenue accountability across dealership networks.",
  path: "/"
});

export default function HomePage() { return <HomeAudiV2 />; }
