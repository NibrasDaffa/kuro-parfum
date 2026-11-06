"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatIdr } from "@/lib/format";
import { ProductDTO } from "@/lib/types";
import { useCart } from "@/store/cart";

export function PurchasePanel({ product }: { product: ProductDTO }) {
  const addItem = useCart((state) => state.addItem);
  const max = Math.min(10, product.stock);
  const [quantity, setQuantity] = useState(1);
  const soldOut = max < 1;

  return (
    <div className="mt-8 border-t border-line pt-8">
      <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Ukuran</p>
      <div className="mt-3">
        <span className="inline-block border border-accent px-4 py-2 text-sm text-accent" aria-pressed="true">
          {product.volume_ml} ml
        </span>
      </div>
      <p className="mt-8 font-bold">{formatIdr(product.price)}</p>
      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center border border-line">
          <button
            type="button"
            className="px-4 py-3"
            aria-label="Kurangi jumlah"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={soldOut}
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{soldOut ? 0 : quantity}</span>
          <button
            type="button"
            className="px-4 py-3"
            aria-label="Tambah jumlah"
            onClick={() => setQuantity((value) => Math.min(max, value + 1))}
            disabled={soldOut}
          >
            +
          </button>
        </div>
        <p className="text-xs text-mute">{soldOut ? "Stok habis" : `${product.stock} tersedia`}</p>
      </div>
      <Button
        className="mt-6 w-full md:w-auto"
        disabled={soldOut}
        onClick={() =>
          addItem(
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0] ?? "",
              volumeMl: product.volume_ml,
              stock: product.stock,
            },
            quantity,
          )
        }
      >
        Tambah ke keranjang
      </Button>
    </div>
  );
}
