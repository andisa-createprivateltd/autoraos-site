import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoraos.company";

export function buildPageMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: `AUTORA OS | ${title}`,
      description,
      url: `${siteUrl.replace(/\/$/, "")}${path}`,
      siteName: "AUTORA OS",
      locale: "en_ZA",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `AUTORA OS | ${title}`,
      description
    }
  };
}
