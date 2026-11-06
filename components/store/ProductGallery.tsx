"use client";

import { useRef, useState } from "react";
import { ProductImage } from "@/components/store/ProductCard";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const current = images[index] ?? images[0];
  const count = images.length;

  function go(next: number) {
    if (count < 2) return;
    setIndex((next + count) % count);
  }

  return (
    <div>
      <div
        className="group relative aspect-[3/4] overflow-hidden bg-surface"
        onTouchStart={(event) => {
          startX.current = event.touches[0]?.clientX ?? 0;
        }}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX ?? startX.current;
          const delta = end - startX.current;
          if (delta > 40) go(index - 1);
          if (delta < -40) go(index + 1);
        }}
      >
        <ProductImage
          src={current}
          alt={`${name}, foto ${index + 1}`}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {count > 1 ? (
          <div className="absolute inset-x-0 bottom-4 flex justify-between px-4">
            <button type="button" onClick={() => go(index - 1)} className="bg-bg/70 px-3 py-2 text-xs uppercase tracking-[0.14em]" aria-label="Foto sebelumnya">
              Prev
            </button>
            <button type="button" onClick={() => go(index + 1)} className="bg-bg/70 px-3 py-2 text-xs uppercase tracking-[0.14em]" aria-label="Foto berikutnya">
              Next
            </button>
          </div>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="mt-3 flex gap-3">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(imageIndex)}
              className={`relative h-20 w-16 border ${imageIndex === index ? "border-accent" : "border-line"}`}
              aria-label={`Lihat foto ${imageIndex + 1}`}
            >
              <ProductImage src={image} alt="" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
