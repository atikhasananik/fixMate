import type { MetadataRoute } from "next";

function getProductionSiteUrl(): string | undefined {
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelDomain) {
    return new URL(`https://${vercelDomain}`).origin;
  }

  const authBaseUrl = process.env.BETTER_AUTH_URL;
  return authBaseUrl ? new URL(authBaseUrl).origin : undefined;
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getProductionSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    ...(siteUrl ? { sitemap: new URL("/sitemap.xml", siteUrl).toString() } : {}),
  };
}
