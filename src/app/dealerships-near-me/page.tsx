import type { Metadata } from "next";
import { DealershipNearMe } from "@/components/dealership-near-me";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Dealership Directory",
  description:
    "Search nearby Chinese-brand dealerships in South Africa and prefill an AUTORA OS revenue audit request from the directory.",
  path: "/dealerships-near-me"
});

export default function DealershipsNearMePage() {
  return <DealershipNearMe />;
}
