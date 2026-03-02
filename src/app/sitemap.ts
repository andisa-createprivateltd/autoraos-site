import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://autoraos.company").replace(/\/$/, "");

  return [
    "",
    "/platform",
    "/pricing",
    "/enterprise",
    "/security",
    "/contact",
    "/request-audit",
    "/integrations",
    "/how-it-works",
    "/dealer-os",
    "/services",
    "/dealerships-near-me",
    "/privacy",
    "/terms",
    "/popia"
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/request-audit" ? 0.9 : 0.75,
    lastModified: new Date()
  }));
}
