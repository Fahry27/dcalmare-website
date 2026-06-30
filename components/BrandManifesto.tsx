import SafeImage from "@/components/SafeImage";

export default function BrandManifesto() {
  return (
    <section className="bg-offwhite py-12 md:py-24">
      <div className="container-pad grid min-w-0 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-10">
        <div className="relative aspect-[4/5] max-h-[430px] min-w-0 overflow-hidden border border-burgundy/10 bg-burgundy md:max-h-none">
          <SafeImage
            src="/brand/dcalmare-story.jpg"
            alt="dCalmare brand story"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            fallbackLabel="Brand Manifesto"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            Brand Manifesto
          </p>
          <h2 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl md:text-5xl">
            A reminder to enjoy the present.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:mt-6 md:leading-8">
            dCalmare combines the founder&apos;s initial, D, with the Italian
            word &quot;calmare&quot; meaning to calm. The brand was born from a
            belief that the best moments in life happen when we slow down.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:leading-8">
            Through summer-inspired graphics, nostalgic photography, and
            thoughtful words, dCalmare creates pieces that remind people to
            enjoy the present.
          </p>
        </div>
      </div>
    </section>
  );
}
