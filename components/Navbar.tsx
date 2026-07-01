"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const count = getTotalItems();
  
  if (count === 0) return null;

  return (
    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-white">
      {count}
    </span>
  );
}

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; username: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(console.error);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-burgundy/10 bg-offwhite/95 backdrop-blur">
      <nav className="container-pad flex min-h-16 items-center justify-between gap-3 md:min-h-20 md:gap-4">
        <Link href="/" className="flex min-h-11 min-w-0 items-center" aria-label="dCalmare home">
          <span className="font-serif text-2xl font-semibold text-burgundy md:text-3xl tracking-tight">
            dCalmare
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex flex-1 justify-end mr-6">
          {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted transition hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
              >
                {item.label}
              </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link 
              href="/profile" 
              className="hidden md:inline-flex items-center justify-center min-h-10 px-4 text-sm font-semibold text-white bg-burgundy rounded-sm transition hover:bg-burgundy-dark"
            >
              Hi, {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="hidden md:inline-flex items-center justify-center min-h-10 px-4 text-sm font-semibold text-burgundy border border-burgundy rounded-sm transition hover:bg-burgundy hover:text-white"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => useCartStore.getState().setIsOpen(true)}
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center text-burgundy transition hover:bg-burgundy/5"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <CartBadge />
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-burgundy/20 text-burgundy md:hidden"
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
        </div>
      </nav>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out md:hidden",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden border-t border-burgundy/10 bg-offwhite">
          <div className="container-pad grid gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-12 items-center py-2 text-base font-medium text-ink transition hover:text-burgundy active:scale-[0.98]"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
