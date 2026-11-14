import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * XML sitemap, served at /sitemap.xml — this is the URL to submit in Google
 * Search Console (Sitemaps → "sitemap.xml"). Next generates the XML from what
 * is returned here, so adding a page to the site means adding a line below.
 *
 * `lastModified` is the build time: redeploying the site tells Google the pages
 * were touched, which is what you want after editing the content file.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/stay`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
