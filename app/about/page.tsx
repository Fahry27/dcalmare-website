import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Read the dCalmare brand story."
};

export default function AboutPage() {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
          About dCalmare
        </p>
        <div>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            One summer can change everything.
          </h1>
          <div className="mt-8 grid gap-5 text-base leading-8 text-muted">
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
            <p className="font-serif text-3xl font-semibold leading-tight text-burgundy">
              One summer can change everything.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
