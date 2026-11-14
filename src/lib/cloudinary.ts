/**
 * Cloudinary helpers shared by the gallery's API route (listing) and the
 * gallery component (uploading, and inserting the photo a guest just added).
 * Only the cloud name and the *unsigned* upload preset are used, so nothing
 * secret is involved.
 */

export type GalleryPhoto = {
  id: string;
  thumb: string;
  full: string;
  width: number;
  height: number;
  by: string;
  at: string;
};

/** A square, auto-cropped thumbnail for the strip. */
export const THUMB = "c_fill,g_auto,w_640,h_640,q_auto,f_auto";
/** The full-size view, capped so phones never download a 6000px original. */
export const FULL = "c_limit,w_1800,h_1800,q_auto,f_auto";

type Asset = { public_id: string; format: string; version: number };

/** Cloudinary delivery URL with the transformation baked in. */
export function cloudinaryUrl(cloudName: string, transform: string, a: Asset) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/v${a.version}/${a.public_id}.${a.format}`;
}

/** Turns an asset (from a list or from an upload response) into a gallery photo. */
export function toPhoto(
  cloudName: string,
  a: Asset & { width?: number; height?: number; created_at?: string; context?: { custom?: Record<string, string> } },
  by = "",
): GalleryPhoto {
  return {
    id: a.public_id,
    thumb: cloudinaryUrl(cloudName, THUMB, a),
    full: cloudinaryUrl(cloudName, FULL, a),
    width: a.width ?? 0,
    height: a.height ?? 0,
    by: by || a.context?.custom?.by || "",
    at: a.created_at ?? new Date().toISOString(),
  };
}
