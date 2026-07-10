import Link from "next/link";
import { CartBadge } from "@/components/ui/cart-badge";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 pt-3">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass-strong border border-white/30 px-6 py-3 shadow-lg shadow-black/5 mx-4">
          <Link href="/" className="font-serif text-xl font-bold text-surface">
            Coop
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-surface/80">
            <Link href="/about" className="hover:text-white transition-premium">About</Link>
            <Link href="/produce" className="hover:text-white transition-premium">Produce</Link>
            <Link href="/news" className="hover:text-white transition-premium">News</Link>
            <Link href="/gallery" className="hover:text-white transition-premium">Gallery</Link>
            <Link href="/contact" className="hover:text-white transition-premium">Contact</Link>
            <Link href="/cart" className="relative">
              <CartBadge />
            </Link>
            <Link
              href="/portal/login"
              className="rounded-lg bg-pit px-4 py-2 text-white transition-premium enabled:hover:-translate-y-0.5"
            >
              Member Login
            </Link>
          </div>
        </nav>
      </header>
      <main
          className="relative z-10 min-h-[60vh]"
          style={{
            background: "linear-gradient(180deg, rgba(132, 162, 79, 0.25) 0%, rgba(53, 64, 38, 0.10) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >{children}</main>
      <footer className="border-t border-line bg-avocado-skin py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-serif text-lg font-bold">Coop</h3>
              <p className="text-sm opacity-80">
                Cooperative Society Limited
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Quick Links</h4>
              <div className="flex flex-col gap-1 text-sm opacity-80">
                <Link href="/about">About Us</Link>
                <Link href="/produce">Our Produce</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Contact</h4>
              <p className="text-sm opacity-80">
                Lusaka, Zambia
                <br />
                info@coop.example
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/20 pt-4 text-center text-xs opacity-60">
            &copy; {new Date().getFullYear()} Coop. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
