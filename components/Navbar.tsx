"use client";

import Link from "next/link";
import { useState } from "react";
import SafeImage from "@/components/SafeImage";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-burgundy/10 bg-offwhite/95 backdrop-blur">
      <nav className="container-pad flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="dCalmare home">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-burgundy/15 bg-cream">
            <SafeImage
              src="/brand/dcalmare-logo.jpg"
              alt="dCalmare logo"
              fill
              sizes="44px"
              className="object-cover"
              fallbackLabel="dC"
              fallbackClassName="text-xs tracking-normal"
            />
          </div>
          <span className="font-serif text-2xl font-semibold text-burgundy">
            dCalmare
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition hover:text-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-burgundy/20 text-burgundy md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={cn("block h-px w-5 bg-current transition", isOpen && "translate-y-2 rotate-45")} />
            <span className={cn("block h-px w-5 bg-current transition", isOpen && "opacity-0")} />
            <span className={cn("block h-px w-5 bg-current transition", isOpen && "-translate-y-2 -rotate-45")} />
          </span>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-burgundy/10 bg-offwhite md:hidden">
          <div className="container-pad grid gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-base font-medium text-ink"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
