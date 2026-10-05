"use client";

import { ImageSquare } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";
import type { ImageAsset } from "@/content/wedding";

type Props = {
  image: ImageAsset;
  /** next/image `sizes` hint — keeps phones from downloading desktop-sized photos */
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Use a dark placeholder (for photos that sit under light text) */
  tone?: "light" | "dark";
  /** Where the placeholder label sits — use "top" when text overlays the photo */
  labelAt?: "center" | "top";
};

/**
 * A photo slot that fills its (relatively positioned) parent.
 * If the file at `image.src` does not exist yet, it renders a clearly labeled
 * placeholder telling you which file to drop into /public.
 */
export function ImageSlot({
  image,
  sizes = "100vw",
  priority,
  className = "",
  imgClassName = "",
  tone = "light",
  labelAt = "center",
}: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {status !== "loaded" && <Placeholder image={image} tone={tone} labelAt={labelAt} pending={status === "loading"} />}
      {status !== "error" && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`object-cover transition-opacity duration-700 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}

function Placeholder({
  image,
  tone,
  labelAt,
  pending,
}: {
  image: ImageAsset;
  tone: "light" | "dark";
  labelAt: "center" | "top";
  pending: boolean;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center gap-3 p-4 text-center ${
        labelAt === "top" ? "justify-start pt-[max(4rem,12dvh)]" : "justify-center"
      } ${
        dark ? "bg-[#3b342c] text-[#e9dfcf]" : "bg-linen text-stone"
      }`}
      style={{
        backgroundImage: dark
          ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 12px, transparent 12px 24px)"
          : "repeating-linear-gradient(135deg, rgba(122,109,92,0.06) 0 12px, transparent 12px 24px)",
      }}
    >
      {!pending && (
        <>
          <ImageSquare size={28} weight="light" className="opacity-60" aria-hidden="true" />
          <span className="text-[0.62rem] uppercase tracking-[0.22em]">{image.label}</span>
          <code className="max-w-full break-all rounded bg-black/5 px-2 py-0.5 text-[0.6rem] opacity-70">
            public{image.src}
          </code>
        </>
      )}
    </div>
  );
}
