"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonClass } from "@/components/ui/Button";

export function Hero() {
  const reduce = useReducedMotion();
  const words = "Aroma yang tidak meminta perhatian.".split(" ");

  return (
    <section className="-mt-20 flex min-h-[100svh] items-end px-5 pb-16 pt-28">
      <div className="mx-auto w-full max-w-content">
        <p className="text-[11px] uppercase tracking-[0.22em] text-accent">Maison Kuro — Jakarta</p>
        <h1 className="mt-6 max-w-4xl font-display text-6xl font-light italic leading-[0.92] sm:text-8xl">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="mr-[0.28em] inline-block"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-mute">
          Parfum high-end untuk yang memilih diam. Quiet luxury, bottled.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className={buttonClass("primary")}>
            Jelajahi koleksi
          </Link>
          <Link href="/#kisah" className={buttonClass("outline")}>
            Kisah kami
          </Link>
        </div>
      </div>
    </section>
  );
}
