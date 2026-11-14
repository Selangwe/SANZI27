import { NextResponse } from "next/server";
import { wedding } from "@/content/wedding";
import { toPhoto, type GalleryPhoto } from "@/lib/cloudinary";

/**
 * Lists the guests' photos.
 *
 * Cloudinary publishes every asset carrying a tag as a JSON list at
 * `/image/list/<tag>.json` (Settings → Security → "Resource list"). It is read
 * here, on the server, rather than in the browser: the response is normalised
 * into exactly what the gallery needs, and we control its caching instead of
 * inheriting Cloudinary's CDN headers.
 */
export const dynamic = "force-dynamic";

type CloudinaryResource = {
  public_id: string;
  format: string;
  version: number;
  width?: number;
  height?: number;
  created_at?: string;
  context?: { custom?: Record<string, string> };
};

export async function GET() {
  const { cloudName, tag } = wedding.gallery;

  if (!cloudName || !tag) {
    return NextResponse.json({ configured: false, photos: [] as GalleryPhoto[] });
  }

  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`, {
      cache: "no-store",
    });

    // 404 is the normal answer while no photo carries the tag yet.
    if (res.status === 404) return NextResponse.json({ configured: true, photos: [] as GalleryPhoto[] });

    // 401 means "Resource list" is still switched off in Cloudinary → Settings →
    // Security. Uploading works, but nobody can see anybody else's photos, so
    // this is a setup problem to report rather than a passing glitch.
    if (res.status === 401) {
      console.warn("[gallery] Cloudinary resource list is disabled (Settings → Security → Resource list)");
      return NextResponse.json({ configured: true, listable: false, photos: [] as GalleryPhoto[] });
    }

    if (!res.ok) throw new Error(`Cloudinary responded ${res.status}`);

    const json = (await res.json()) as { resources?: CloudinaryResource[] };
    const photos: GalleryPhoto[] = (json.resources ?? [])
      .map((r) => toPhoto(cloudName, r))
      .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));

    return NextResponse.json({ configured: true, photos });
  } catch (err) {
    console.error("[gallery] list failed", err);
    return NextResponse.json(
      { configured: true, photos: [] as GalleryPhoto[], error: "We couldn't load the photos just now." },
      { status: 502 },
    );
  }
}
