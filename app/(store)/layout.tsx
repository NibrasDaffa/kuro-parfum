import { CartDrawer } from "@/components/store/CartDrawer";
import { Footer } from "@/components/store/Footer";
import { Navbar } from "@/components/store/Navbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        Lewati ke konten
      </a>
      <Navbar />
      <main id="konten" className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
