import { NextResponse } from "next/server";
import { wedding } from "@/content/wedding";
import { toPhoto, type GalleryPhoto } from "@/lib/cloudinary";

/**
 * Lists the guests' photos, newest first.
 *
 * Two ways to read them, tried in that order:
 *
 *  1. **Cloudinary's Admin API** (preferred) — needs CLOUDINARY_API_KEY and
 *     CLOUDINARY_API_SECRET. They are read here, on the server, and never
 *     reach the browser. This is the dependable route: it needs no account-wide
 *     setting, and it does not make every tag on the account world-readable.
 *  2. **The public tag listing** at `/image/list/<tag>.json` — only works when
 *     "Resource list" is *unticked* under Settings → Security → Restricted
 *     image types. Kept as a fallback for a deployment with no API keys.
 *
 * Uploading never depends on either: the browser posts straight to an unsigned
 * upload preset, and a guest's own photo appears immediately regardless.
 */
export const dynamic = "force-dynamic";

/** Seconds the upstream answer is reused, so the Admin API's hourly quota lasts */
const CACHE_SECONDS = 30;

type CloudinaryResource = {
  public_id: string;
  format: string;
  version: number;
  width?: number;
  height?: number;
  created_at?: string;
  context?: { custom?: Record<string, string> };
};

type Listing = { photos: GalleryPhoto[] } | { blocked: true };

export async function GET() {
  const { cloudName, tag } = wedding.gallery;

  if (!cloudName || !tag) {
    return NextResponse.json({ configured: false, photos: [] as GalleryPhoto[] });
  }

  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  try {
    const listing = key && secret
      ? await viaAdminApi(cloudName, tag, key, secret)
      : await viaPublicList(cloudName, tag);

    if ("blocked" in listing) {
      console.warn(
        key && secret
          ? "[gallery] Cloudinary rejected the Admin API credentials — check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET"
          : '[gallery] No Cloudinary API credentials, and the public tag listing is restricted: add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or untick "Resource list" under Settings → Security → Restricted image types',
      );
      return NextResponse.json({ configured: true, listable: false, photos: [] as GalleryPhoto[] });
    }

    return NextResponse.json({ configured: true, photos: listing.photos });
  } catch (err) {
    console.error("[gallery] list failed", err);
    return NextResponse.json(
      { configured: true, photos: [] as GalleryPhoto[], error: "We couldn't load the photos just now." },
      { status: 502 },
    );
  }
}

/** Admin API: resources carrying the tag, with the uploader name from `context`. */
async function viaAdminApi(cloudName: string, tag: string, key: string, secret: string): Promise<Listing> {
  const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/by_tag/${encodeURIComponent(tag)}`);
  url.searchParams.set("max_results", "100");
  url.searchParams.set("context", "true");
  url.searchParams.set("direction", "desc");

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
    next: { revalidate: CACHE_SECONDS },
  });

  // 401 and 403 mean the key pair is wrong or lacks permission; 404 is what
  // Cloudinary answers when the key is not valid for this cloud at all (a real
  // key with an unknown tag returns 200 and an empty list). All three are setup
  // problems to report rather than retry.
  if (res.status === 401 || res.status === 403 || res.status === 404) return { blocked: true };
  if (!res.ok) throw new Error(`Cloudinary Admin API responded ${res.status}`);

  const json = (await res.json()) as { resources?: CloudinaryResource[] };
  return { photos: sorted(cloudName, json.resources ?? []) };
}

/** Public tag listing, for a deployment with no API credentials. */
async function viaPublicList(cloudName: string, tag: string): Promise<Listing> {
  const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`, {
    next: { revalidate: CACHE_SECONDS },
  });

  // 404 is the normal answer while no photo carries the tag yet.
  if (res.status === 404) return { photos: [] };
  if (res.status === 401) return { blocked: true };
  if (!res.ok) throw new Error(`Cloudinary responded ${res.status}`);

  const json = (await res.json()) as { resources?: CloudinaryResource[] };
  return { photos: sorted(cloudName, json.resources ?? []) };
}

function sorted(cloudName: string, resources: CloudinaryResource[]): GalleryPhoto[] {
  return resources
    .map((r) => toPhoto(cloudName, r))
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}
