import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-burgundy-dark text-offwhite w-full overflow-hidden border-t border-burgundy/20">
      <div className="container-pad py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center font-serif text-4xl font-semibold tracking-wide hover:text-cream transition-colors">
              dCalmare
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-offwhite/70">
              Summer-inspired graphic tees made to remind you to slow down,
              feel present, and wear the moment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-cream mb-6">
                Explore
              </h2>
              <div className="flex flex-col gap-4 text-sm text-offwhite/80">
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-cream mb-6">
                Contact
              </h2>
              <div className="flex flex-col gap-4 text-sm text-offwhite/80">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: +62 812-3456-7890
                </a>
                <a href="https://instagram.com/dcalmare" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Instagram: @dcalmare
                </a>
                <a href="mailto:hello@dcalmare.com" className="hover:text-white transition-colors">
                  Email: hello@dcalmare.com
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-offwhite/10 pt-8 text-xs text-offwhite/50">
          <p>&copy; {new Date().getFullYear()} dCalmare. All rights reserved.</p>
          <p className="mt-2 md:mt-0 italic font-serif text-sm">One summer can change everything.</p>
        </div>
      </div>
    </footer>
  );
}
