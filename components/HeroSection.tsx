import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export default function HeroSection() {
  return (
    <section
      className="bg-burgundy bg-cover bg-center text-offwhite"
      style={{ backgroundImage: "url('/brand/burgundy-texture.jpg')" }}
    >
      <div className="container-pad grid min-h-[calc(100svh-5rem)] items-center gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-cream">
            First Drop / Graphic Tees
          </p>
          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            One summer can change everything.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-offwhite/78 sm:text-lg">
            Summer-inspired graphic tees made to remind you to slow down, feel
            present, and wear the moment.
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-flex min-h-12 items-center justify-center bg-offwhite px-7 text-sm font-semibold uppercase tracking-[0.18em] text-burgundy transition hover:bg-cream"
          >
            Shop The First Drop
          </Link>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-burgundy-dark/35">
          <SafeImage
            src="/products/bottle-collection-tee-lifestyle.jpg"
            alt="dCalmare first drop styled outfit"
            fill
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
            fallbackLabel="dCalmare First Drop"
          />
        </div>
      </div>
    </section>
  );
}
