"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  sizes: string;
  fallback: React.ReactNode;
  fit?: "contain" | "cover";
  priority?: boolean;
  /** Extra classes for the <img> (e.g. a drop-shadow that follows the PNG's alpha) */
  imgClassName?: string;
  /** Called once the PNG has either loaded or failed (and the fallback shows) */
  onSettled?: () => void;
};

/** One envelope layer: the transparent PNG if present, otherwise the SVG fallback. */
export function LayerImage({
  src,
  alt = "",
  sizes,
  fallback,
  fit = "contain",
  priority = true,
  imgClassName = "",
  onSettled,
}: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (status !== "loading") onSettled?.();
  }, [status, onSettled]);

  return (
    <div className="absolute inset-0">
      {status === "error" && fallback}
      {status !== "error" && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`select-none ${fit === "cover" ? "object-cover" : "object-contain"} ${imgClassName}`}
        />
      )}
    </div>
  );
}
