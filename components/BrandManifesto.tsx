import SafeImage from "@/components/SafeImage";

export default function BrandManifesto() {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="relative aspect-[4/5] border border-burgundy/10 bg-burgundy">
          <SafeImage
            src="/brand/dcalmare-story.jpg"
            alt="dCalmare brand story"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            fallbackLabel="Brand Manifesto"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
            Brand Manifesto
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">
            A reminder to enjoy the present.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
            dCalmare combines the founder&apos;s initial, D, with the Italian
            word &quot;calmare&quot; meaning to calm. The brand was born from a
            belief that the best moments in life happen when we slow down.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            Through summer-inspired graphics, nostalgic photography, and
            thoughtful words, dCalmare creates pieces that remind people to
            enjoy the present.
          </p>
        </div>
      </div>
    </section>
  );
}
