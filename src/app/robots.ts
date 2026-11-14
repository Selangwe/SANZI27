import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

/**
 * robots.txt, served at /robots.txt. It points crawlers at the sitemap, and
 * keeps the API routes out of the index — they return JSON, never a page.
 *
 * On a preview deployment (NEXT_PUBLIC_NOINDEX=1) everything is disallowed, so
 * a staging copy of the invitation never competes with the live site.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
