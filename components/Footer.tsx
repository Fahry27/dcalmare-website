import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-burgundy-dark text-offwhite">
      <div className="container-pad grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-3xl font-semibold">
            dCalmare
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-offwhite/75">
            Summer-inspired graphic tees made to remind you to slow down,
            feel present, and wear the moment.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cream">
            Explore
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-offwhite/75">
            <Link href="/shop" className="transition hover:text-white">
              Shop
            </Link>
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/size-guide" className="transition hover:text-white">
              Size Guide
            </Link>
            <Link href="/faq" className="transition hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cream">
            Contact
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-offwhite/75">
            <span>WhatsApp: +62 812-3456-7890</span>
            <span>Instagram: @dcalmare</span>
            <span>Email: hello@dcalmare.com</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-pad text-xs text-offwhite/60">
          &copy; {new Date().getFullYear()} dCalmare. One summer can change
          everything.
        </div>
      </div>
    </footer>
  );
}
