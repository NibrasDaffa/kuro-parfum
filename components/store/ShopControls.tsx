"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AROMAS, CATEGORIES } from "@/lib/types";

export type ShopFilters = {
  q: string;
  category: string;
  aroma: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

const sorts = [
  { value: "newest", label: "Terbaru" },
  { value: "popular", label: "Populer" },
  { value: "price_asc", label: "Harga ↑" },
  { value: "price_desc", label: "Harga ↓" },
];

function FilterFields({
  filters,
  onChange,
}: {
  filters: ShopFilters;
  onChange: (next: Partial<ShopFilters>) => void;
}) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.16em] text-mute">Kategori</legend>
        <div className="mt-4 space-y-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange({ category: filters.category === item.value ? "" : item.value })}
              className={`block text-left text-sm ${filters.category === item.value ? "text-accent" : "text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.16em] text-mute">Aroma</legend>
        <div className="mt-4 space-y-2">
          {AROMAS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange({ aroma: filters.aroma === item.value ? "" : item.value })}
              className={`block text-left text-sm ${filters.aroma === item.value ? "text-accent" : "text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.16em] text-mute">Harga</legend>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs text-mute">
            Min
            <input
              inputMode="numeric"
              value={filters.minPrice}
              onChange={(event) => onChange({ minPrice: event.target.value.replace(/[^\d]/g, "") })}
              className="mt-2 w-full border border-line bg-surface px-3 py-2 text-sm text-ink"
            />
          </label>
          <label className="text-xs text-mute">
            Maks
            <input
              inputMode="numeric"
              value={filters.maxPrice}
              onChange={(event) => onChange({ maxPrice: event.target.value.replace(/[^\d]/g, "") })}
              className="mt-2 w-full border border-line bg-surface px-3 py-2 text-sm text-ink"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export function ShopControls({
  initial,
  total,
  children,
}: {
  initial: ShopFilters;
  total: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState(initial);
  const [draft, setDraft] = useState(initial.q);
  const [open, setOpen] = useState(false);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    setFilters(initial);
    setDraft(initial.q);
  }, [initial]);

  function push(next: ShopFilters) {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.aroma) params.set("aroma", next.aroma);
    if (next.minPrice) params.set("minPrice", next.minPrice);
    if (next.maxPrice) params.set("maxPrice", next.maxPrice);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  }

  function update(partial: Partial<ShopFilters>) {
    const next = { ...filtersRef.current, q: draft, ...partial };
    setFilters(next);
    push(next);
  }

  useEffect(() => {
    if (draft === filtersRef.current.q) return;
    const handle = window.setTimeout(() => {
      const next = { ...filtersRef.current, q: draft };
      setFilters(next);
      push(next);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [draft]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <button
          type="button"
          className="border border-line px-4 py-3 text-[11px] uppercase tracking-[0.14em] lg:hidden"
          onClick={() => setOpen(true)}
        >
          Filter
        </button>
        <label className="flex-1">
          <span className="sr-only">Cari parfum</span>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Cari nama atau notes"
            className="w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-mute"
          />
        </label>
        <label className="md:w-48">
          <span className="sr-only">Urutkan</span>
          <select
            value={filters.sort || "newest"}
            onChange={(event) => update({ sort: event.target.value })}
            className="w-full border border-line bg-bg px-4 py-3 text-sm"
          >
            {sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-mute">{total} parfum</p>
      <div className="mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <FilterFields filters={filters} onChange={update} />
        </aside>
        <div>{children}</div>
      </div>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Tutup filter"
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[min(100%,320px)] overflow-y-auto border-r border-line bg-bg p-6 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.16em]">Filter</p>
                <button type="button" onClick={() => setOpen(false)} className="text-[11px] uppercase tracking-[0.14em] text-mute">
                  Tutup
                </button>
              </div>
              <FilterFields
                filters={filters}
                onChange={(partial) => {
                  update(partial);
                }}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
