"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cartCount, useCart } from "@/store/cart";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/shop", label: "Koleksi" },
  { href: "/#kisah", label: "Kisah" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const items = useCart((state) => state.items);
  const openCart = useCart((state) => state.open);
  const count = cartCount(items);
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setReady(useCart.persist.hasHydrated());
    return useCart.persist.onFinishHydration(() => setReady(true));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${
        solid ? "border-b border-line bg-bg/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-content items-center justify-between px-5">
        <Link href="/" className="font-display text-3xl tracking-[0.18em]">
          KURO
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Utama">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] uppercase tracking-[0.16em] ${
                pathname === link.href ? "text-accent" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            className="relative px-2 py-2 text-[11px] uppercase tracking-[0.16em]"
            aria-label="Buka keranjang"
          >
            Keranjang
            {ready && count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[10px] font-bold text-bg">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="px-2 py-2 text-[11px] uppercase tracking-[0.16em] md:hidden"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav className="border-t border-line bg-bg px-5 py-4 md:hidden" aria-label="Seluler">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block py-3 text-sm uppercase tracking-[0.14em]">
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
