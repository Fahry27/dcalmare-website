import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export default function HeroSection() {
  return (
    <section
      className="bg-burgundy bg-cover bg-center text-offwhite"
      style={{ backgroundImage: "url('/brand/burgundy-texture.jpg')" }}
    >
      <div className="container-pad grid min-h-[calc(100svh-4rem)] items-center gap-8 py-12 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:py-20">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cream sm:tracking-[0.26em]">
            First Drop / Graphic Tees
          </p>
          <h1 className="max-w-4xl break-words font-serif text-4xl font-semibold leading-[1.05] text-white min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
            One summer can change everything.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-offwhite/78 sm:text-lg sm:leading-8">
            Summer-inspired graphic tees made to remind you to slow down, feel
            present, and wear the moment.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center bg-offwhite px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-burgundy transition hover:bg-white hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy sm:w-auto sm:px-7 sm:tracking-[0.18em]"
          >
            Shop The First Drop
          </Link>
        </div>

        <div className="relative aspect-[4/5] max-h-[430px] min-w-0 overflow-hidden border border-white/15 bg-burgundy-dark/35 md:max-h-none">
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
