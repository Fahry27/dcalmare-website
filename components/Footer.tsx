import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-burgundy-dark text-offwhite">
      <div className="container-pad grid gap-9 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <Link href="/" className="inline-flex min-h-11 items-center font-serif text-3xl font-semibold">
            dCalmare
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-offwhite/75">
            Summer-inspired graphic tees made to remind you to slow down,
            feel present, and wear the moment.
          </p>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cream">
            Explore
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-offwhite/75">
            <Link href="/shop" className="flex min-h-11 items-center transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-dark">
              Shop
            </Link>
            <Link href="/about" className="flex min-h-11 items-center transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-dark">
              About
            </Link>
            <Link href="/size-guide" className="flex min-h-11 items-center transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-dark">
              Size Guide
            </Link>
            <Link href="/faq" className="flex min-h-11 items-center transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-dark">
              FAQ
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cream">
            Contact
          </h2>
          <div className="mt-4 grid gap-3 break-words text-sm leading-relaxed text-offwhite/75">
            <span className="min-h-8">WhatsApp: +62 812-3456-7890</span>
            <span className="min-h-8">Instagram: @dcalmare</span>
            <span className="min-h-8">Email: hello@dcalmare.com</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-5 pb-12">
        <div className="container-pad text-xs text-offwhite/60">
          &copy; {new Date().getFullYear()} dCalmare. One summer can change
          everything.
        </div>
      </div>
    </footer>
  );
}
