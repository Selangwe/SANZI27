"use client";

import { Camera, CaretLeft, CaretRight, ImageSquare, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { toPhoto, type GalleryPhoto } from "@/lib/cloudinary";
import { readLocal, writeLocal } from "@/lib/storage";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const MINE_KEY = "wedding-gallery-mine";
/** Longest edge a photo is shrunk to before it leaves the phone */
const MAX_EDGE = 2000;

/**
 * The guests' photo wall, after the client's blueprint: a camera button that
 * uploads, a bordered strip showing five photos at a time, arrows and a swipe
 * to see the rest, and a tap to open any photo full size.
 *
 * Photos a guest adds appear immediately — Cloudinary's tag listing is CDN
 * cached for about a minute, so the upload response is placed straight into the
 * strip and remembered on the device until the listing catches up.
 */
export function Gallery() {
  const { gallery } = wedding;
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [mine, setMine] = useState<GalleryPhoto[]>([]);
  const [configured, setConfigured] = useState(true);
  /** False while Cloudinary still restricts the tag listing (see the note below) */
  const [listable, setListable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Photos this guest added, from this device, shown until the listing has them
  useEffect(() => setMine(readLocal<GalleryPhoto[]>(MINE_KEY) ?? []), []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const json = (await res.json()) as {
        configured?: boolean;
        listable?: boolean;
        photos?: GalleryPhoto[];
        error?: string;
      };
      setConfigured(json.configured !== false);
      setListable(json.listable !== false);
      setPhotos(json.photos ?? []);
      if (json.error) setError(json.error);
    } catch {
      setError("We couldn't load the photos just now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // The listing, with this device's own uploads in front and duplicates dropped
  const listed = new Set(photos.map((p) => p.id));
  const all = [...mine.filter((p) => !listed.has(p.id)), ...photos];

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");

    if (!gallery.cloudName || !gallery.uploadPreset) {
      setConfigured(false);
      return;
    }

    const picked = Array.from(files);
    const added: GalleryPhoto[] = [];

    for (let i = 0; i < picked.length; i++) {
      const file = picked[i];

      if (!file.type.startsWith("image/")) {
        setError(file.name + " isn't an image — please pick a photo.");
        continue;
      }
      if (file.size > gallery.maxFileMb * 1024 * 1024) {
        setError(file.name + " is larger than " + gallery.maxFileMb + "MB.");
        continue;
      }

      try {
        const body = new FormData();
        body.append("file", await shrink(file));
        body.append("upload_preset", gallery.uploadPreset);
        body.append("tags", gallery.tag);
        const by = name.trim().replace(/[|=]/g, " ").slice(0, 60);
        if (by) body.append("context", "by=" + by);

        const asset = await post(
          "https://api.cloudinary.com/v1_1/" + gallery.cloudName + "/image/upload",
          body,
          // One bar across the whole batch, so picking five photos reads as one upload
          (pct) => setProgress(Math.round(((i + pct / 100) / picked.length) * 100)),
        );
        added.push(toPhoto(gallery.cloudName, asset, by));
      } catch (err) {
        // Cloudinary's wording ("Upload preset not found"…) means nothing to a
        // guest, so it goes to the console and they get a plain sentence.
        console.error("[gallery] upload failed", err);
        setError("That upload didn't go through — please try again.");
      }
    }

    setProgress(null);
    if (added.length) {
      const next = [...added, ...mine].slice(0, 40);
      setMine(next);
      writeLocal(MINE_KEY, next);
      // Pick the listing up again shortly, once Cloudinary's cache has turned over
      setTimeout(() => void load(), 60_000);
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <section id="gallery" className="paper relative px-6 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeading title={gallery.heading} />
        <Reveal className="mx-auto mt-6 max-w-lg text-center">
          <p className="font-display text-lg italic leading-relaxed text-stone">{gallery.intro}</p>
        </Reveal>

        {/* Camera button, and the name attached to whatever this guest adds */}
        <Reveal className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => void upload(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={progress !== null}
            className="btn btn-solid w-full sm:w-auto"
          >
            <Camera size={18} weight="light" aria-hidden="true" />
            {progress !== null ? "Uploading… " + progress + "%" : gallery.uploadLabel}
          </button>
          <label className="w-full sm:w-56">
            <span className="sr-only">{gallery.nameLabel}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 60))}
              placeholder={gallery.nameLabel}
              autoComplete="name"
              className="field text-center sm:text-left"
            />
          </label>
        </Reveal>

        {progress !== null && (
          <div
            className="mx-auto mt-4 h-1 max-w-sm overflow-hidden rounded-full bg-sand/70"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Upload progress"
          >
            <div
              className="h-full rounded-full bg-sage transition-[width] duration-200"
              style={{ width: progress + "%" }}
            />
          </div>
        )}

        <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-wax">
          {error}
        </p>

        {!configured ? (
          <Reveal className="card mx-auto mt-6 max-w-xl px-6 py-8 text-center">
            <ImageSquare size={28} weight="light" className="mx-auto text-taupe" aria-hidden="true" />
            <p className="mt-4 text-sm leading-relaxed text-stone">
              Photo sharing isn&apos;t switched on yet. Add your Cloudinary <code>cloudName</code> and{" "}
              <code>uploadPreset</code> in <code>src/content/wedding.ts</code> — the steps are written above that block.
            </p>
          </Reveal>
        ) : (
          <Strip photos={all} loading={loading} emptyLabel={gallery.emptyLabel} onOpen={setOpen} />
        )}

        {configured && all.length > 0 && (
          <p className="mt-6 text-center text-[0.62rem] uppercase tracking-[0.25em] text-taupe">{gallery.viewLabel}</p>
        )}

        {/* Photos upload fine, but nobody can see anyone else's until this is ticked */}
        {configured && !listable && (
          <Reveal className="card mx-auto mt-6 max-w-xl px-6 py-6 text-center">
            <p className="text-sm leading-relaxed text-stone">
              Photos are uploading, but each guest can only see their own so far. Add{" "}
              <code>CLOUDINARY_API_KEY</code> and <code>CLOUDINARY_API_SECRET</code> to the deployment&apos;s
              environment variables (Cloudinary → Settings → API Keys), which lets the site read the shared gallery.
            </p>
          </Reveal>
        )}
      </div>

      <AnimatePresence>
        {open !== null && all[open] && (
          <Lightbox photos={all} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── The strip ─────────────────────────────────────────────────────────────── */

function Strip({
  photos,
  loading,
  emptyLabel,
  onOpen,
}: {
  photos: GalleryPhoto[];
  loading: boolean;
  emptyLabel: string;
  onOpen: (i: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const reduce = useReducedMotion();

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync, photos.length]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  useDragScroll(track, reduce);

  return (
    <Reveal className="gal-frame relative mt-8 p-3 sm:p-4">
      <div ref={track} onScroll={sync} className="gal-track no-scrollbar" aria-label="Guest photos">
        {photos.length === 0
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="gal-card">
                <div className="aspect-square rounded-xl border border-dashed border-sand bg-linen/60" />
              </div>
            ))
          : photos.map((photo, i) => <Card key={photo.id} photo={photo} index={i} onOpen={onOpen} />)}
      </div>

      {photos.length === 0 && (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[0.68rem] uppercase tracking-[0.25em] text-taupe">
          {loading ? "Loading photos…" : emptyLabel}
        </p>
      )}

      {photos.length > 0 && (
        <>
          <Arrow dir={-1} onClick={() => page(-1)} disabled={atStart} />
          <Arrow dir={1} onClick={() => page(1)} disabled={atEnd} />
        </>
      )}
    </Reveal>
  );
}

/** One photo card: fades and rises as it enters the strip, tap to open. */
function Card({ photo, index, onOpen }: { photo: GalleryPhoto; index: number; onOpen: (i: number) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setShown(true);
      return;
    }
    // Watched against the strip itself, so cards animate in as they are scrolled
    // sideways into view, not only when the section first appears.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { root: el.closest(".gal-track"), threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const delay = (index % 5) * 0.06;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(index)}
      className="gal-card group text-left"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px) scale(0.97)",
        transition: reduce
          ? "none"
          : "opacity .6s var(--ease-luxe) " + delay + "s, transform .6s var(--ease-luxe) " + delay + "s",
      }}
      aria-label={photo.by ? "Photo by " + photo.by + " — view full size" : "View photo full size"}
    >
      <div className="overflow-hidden rounded-xl bg-linen">
        <div className="aspect-square overflow-hidden">
          {/* A plain img: Cloudinary already serves a sized, f_auto/q_auto file,
              so putting Next's optimiser in front of it would only re-encode it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.thumb}
            alt={photo.by ? "Photo shared by " + photo.by : "Photo shared by a guest"}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
        <span className="block truncate bg-linen/80 px-2 py-1.5 text-center text-[0.6rem] uppercase tracking-[0.18em] text-taupe">
          {photo.by || "A guest"}
        </span>
      </div>
    </button>
  );
}

function Arrow({ dir, onClick, disabled }: { dir: 1 | -1; onClick: () => void; disabled: boolean }) {
  const Caret = dir === 1 ? CaretRight : CaretLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Next photos" : "Previous photos"}
      className={`absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-ivory text-ink shadow-[0_8px_20px_-12px_rgba(18,20,19,0.45)] transition-opacity sm:flex ${
        dir === 1 ? "-right-4" : "-left-4"
      } ${disabled ? "pointer-events-none opacity-0" : "opacity-100 hover:border-stone"}`}
    >
      <Caret size={16} weight="light" aria-hidden="true" />
    </button>
  );
}

/* ── Full-size view ────────────────────────────────────────────────────────── */

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];

  // Hold the page still behind the photo (the same lock the envelope uses)
  useEffect(() => {
    document.documentElement.classList.add("scroll-locked");
    return () => document.documentElement.classList.remove("scroll-locked");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onIndex]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        key={photo.id}
        src={photo.full}
        alt={photo.by ? "Photo shared by " + photo.by : "Photo shared by a guest"}
        className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      />

      <p className="absolute inset-x-0 bottom-6 text-center text-[0.62rem] uppercase tracking-[0.25em] text-ivory/70">
        {photo.by ? "Shared by " + photo.by : "Shared by a guest"}
        {photos.length > 1 ? " · " + (index + 1) + " / " + photos.length : ""}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory"
      >
        <X size={18} weight="light" aria-hidden="true" />
      </button>

      {photos.length > 1 && (
        <>
          <StepButton side="left" onClick={() => onIndex((index - 1 + photos.length) % photos.length)} />
          <StepButton side="right" onClick={() => onIndex((index + 1) % photos.length)} />
        </>
      )}
    </motion.div>
  );
}

function StepButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Caret = side === "right" ? CaretRight : CaretLeft;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={side === "right" ? "Next photo" : "Previous photo"}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory sm:flex ${
        side === "right" ? "right-4" : "left-4"
      }`}
    >
      <Caret size={20} weight="light" aria-hidden="true" />
    </button>
  );
}

/* ── Behaviour ─────────────────────────────────────────────────────────────── */

/**
 * Drag the strip with a mouse or trackpad, and let it glide to a stop.
 * The glide is a requestAnimationFrame loop over the track's scrollLeft, with
 * friction applied each frame. Touch devices keep their own native momentum, so
 * this only runs for a real pointer drag.
 */
function useDragScroll(ref: React.RefObject<HTMLDivElement | null>, reduce: boolean | null) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;
    let raf = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      dragging = true;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      velocity = 0;
      lastT = performance.now();
      el.classList.add("is-dragging");
    };

    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = (lastX - e.clientX) / dt; // px per ms, positive = moving right
      lastX = e.clientX;
      lastT = now;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };

    const up = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");

      let v = velocity * 16; // px per frame
      const glide = () => {
        v *= 0.94;
        el.scrollLeft += v;
        if (Math.abs(v) > 0.4) raf = requestAnimationFrame(glide);
      };
      if (Math.abs(v) > 0.4) raf = requestAnimationFrame(glide);
    };

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [ref, reduce]);
}

/**
 * Shrinks a photo to MAX_EDGE on its longest side before it is uploaded, so a
 * guest on mobile data waits seconds rather than minutes. If anything about the
 * decode fails, the original file is uploaded untouched.
 */
async function shrink(file: File): Promise<Blob | File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    return blob ?? file;
  } catch {
    return file;
  }
}

/** POST with upload progress — fetch cannot report it, XMLHttpRequest can. */
function post(url: string, body: FormData, onProgress: (pct: number) => void) {
  return new Promise<{ public_id: string; format: string; version: number; width?: number; height?: number }>(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
      };
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) resolve(json);
          else reject(new Error(json?.error?.message || "Upload failed (" + xhr.status + ")"));
        } catch {
          reject(new Error("Upload failed (" + xhr.status + ")"));
        }
      };
      xhr.onerror = () => reject(new Error("Upload failed — please check your connection."));
      xhr.send(body);
    },
  );
}
