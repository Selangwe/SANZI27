/**
 * The site's canonical address, used for metadata, Open Graph images, the
 * sitemap and robots.txt. It is the *www* host on purpose: Vercel serves the
 * site there and 308-redirects the bare sanzi27.uk to it, so a sitemap or
 * canonical naming the apex would point at URLs that redirect.
 *
 * Override it per environment with NEXT_PUBLIC_SITE_URL (e.g. a preview
 * deployment, or if the primary domain is ever changed in Vercel).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.sanzi27.uk";

/**
 * Whether search engines may index the site. Submitting a sitemap to Google
 * Search Console only does something when this is true; set
 * NEXT_PUBLIC_NOINDEX=1 on preview deployments to keep them out of search.
 */
export const indexable = process.env.NEXT_PUBLIC_NOINDEX !== "1";
