import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://createprivateltd.co.za";

  return [
    "",
    "/dealer-os",
    "/services",
    "/pricing",
    "/book",
    "/dealerships-near-me",
    "/founder-narrative",
    "/case-studies",
    "/about",
    "/contact"
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.75,
    lastModified: new Date()
  }));
}
