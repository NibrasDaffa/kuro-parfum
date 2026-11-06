"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buttonClass } from "@/components/ui/Button";
import { formatIdr } from "@/lib/format";
import { cartSubtotal, useCart } from "@/store/cart";
import { ProductImage } from "@/components/store/ProductCard";

export function CartDrawer() {
  const items = useCart((state) => state.items);
  const isOpen = useCart((state) => state.isOpen);
  const close = useCart((state) => state.close);
  const setQuantity = useCart((state) => state.setQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const subtotal = cartSubtotal(items);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Tutup keranjang"
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-bg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", duration: 0.35 }}
            role="dialog"
            aria-label="Keranjang"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.16em]">Keranjang</p>
              <button type="button" onClick={close} className="text-[11px] uppercase tracking-[0.16em] text-mute">
                Tutup
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
              {items.length === 0 ? (
                <p className="text-sm text-mute">Keranjang masih kosong.</p>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="relative h-24 w-16 shrink-0 bg-surface">
                      <ProductImage src={item.image} alt={item.name} sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/shop/${item.slug}`} onClick={close} className="font-display text-2xl leading-none">
                        {item.name}
                      </Link>
                      <p className="mt-2 text-xs text-mute">
                        {item.volumeMl} ml · {formatIdr(item.price)}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <button type="button" aria-label="Kurangi" onClick={() => setQuantity(item.productId, item.quantity - 1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" aria-label="Tambah" onClick={() => setQuantity(item.productId, item.quantity + 1)}>
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-[11px] uppercase tracking-[0.12em] text-mute"
                          onClick={() => removeItem(item.productId)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-line px-5 py-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-mute">Subtotal</span>
                <span className="font-bold">{formatIdr(subtotal)}</span>
              </div>
              <Link href="/cart" onClick={close} className={`${buttonClass("outline")} mb-3 w-full`}>
                Lihat keranjang
              </Link>
              <Link
                href="/checkout"
                onClick={close}
                aria-disabled={items.length === 0}
                className={`${buttonClass("primary")} w-full ${items.length === 0 ? "pointer-events-none opacity-40" : ""}`}
              >
                Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
