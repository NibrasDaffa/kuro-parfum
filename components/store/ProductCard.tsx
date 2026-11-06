"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, formatIdr } from "@/lib/format";
import { ProductDTO } from "@/lib/types";
import { useCart } from "@/store/cart";

function canOptimize(src: string) {
  try {
    const host = new URL(src).hostname;
    return host === "images.unsplash.com" || host === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return <div className={`bg-surface ${className ?? ""}`} />;
  }

  if (!canOptimize(src)) {
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className ?? ""}`} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      className={`object-cover ${className ?? ""}`}
    />
  );
}

export function ProductCard({ product, index = 0 }: { product: ProductDTO; index?: number }) {
  const addItem = useCart((state) => state.addItem);
  const reduce = useReducedMotion();
  const soldOut = product.stock < 1;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(index, 8) * 0.05 }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden border border-line bg-surface transition-shadow duration-300 group-hover:shadow-[0_0_0_1px_#C9A84C]">
          <ProductImage
            src={product.images[0]}
            alt={`${product.name}, parfum Kuro`}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.is_new ? <Badge>New</Badge> : null}
            {product.is_featured ? <Badge>Best Seller</Badge> : null}
          </div>
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-mute">{categoryLabel(product.category)}</p>
          <Link href={`/shop/${product.slug}`} className="mt-1 block font-display text-2xl leading-none">
            {product.name}
          </Link>
          <p className="mt-2 text-xs text-mute">{product.volume_ml} ml</p>
        </div>
        <p className="text-sm font-bold">{formatIdr(product.price)}</p>
      </div>
      <button
        type="button"
        disabled={soldOut}
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] ?? "",
            volumeMl: product.volume_ml,
            stock: product.stock,
          })
        }
        className="mt-4 w-full border border-accent px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-accent opacity-100 transition-opacity duration-200 hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-40 md:opacity-0 md:group-hover:opacity-100"
      >
        {soldOut ? "Habis" : "Tambah ke keranjang"}
      </button>
    </motion.article>
  );
}
