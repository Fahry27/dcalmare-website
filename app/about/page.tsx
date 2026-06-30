import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Read the dCalmare brand story."
};

export default function AboutPage() {
  return (
    <section className="bg-offwhite py-12 md:py-24">
      <div className="container-pad grid min-w-0 gap-8 md:grid-cols-[0.75fr_1.25fr] md:gap-10">
        <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
          About dCalmare
        </p>
        <div className="min-w-0">
          <h1 className="break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
            One summer can change everything.
          </h1>
          <div className="mt-7 grid gap-5 text-base leading-relaxed text-muted md:mt-8 md:leading-8">
            <p>
              dCalmare combines the founder&apos;s initial, D, with the Italian
              word &quot;calmare&quot; — meaning to calm.
            </p>
            <p>
              The brand was born from a belief that the best moments in life
              happen when we slow down.
            </p>
            <p>
              Through summer-inspired graphics, nostalgic photography, and
              thoughtful words, dCalmare creates pieces that remind people to
              enjoy the present.
            </p>
            <p className="break-words font-serif text-3xl font-semibold leading-tight text-burgundy">
              One summer can change everything.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
