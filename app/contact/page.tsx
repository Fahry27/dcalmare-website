import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact dCalmare through WhatsApp, Instagram, or email."
};

export default function ContactPage() {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
            Contact
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Need help with your order?
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">
            Reach dCalmare through these placeholder channels. For order flow,
            please checkout on the website before confirming payment via
            WhatsApp.
          </p>
        </div>
        <div className="grid gap-4">
          {[
            ["WhatsApp", "+62 812-3456-7890"],
            ["Instagram", "@dcalmare"],
            ["Email", "hello@dcalmare.com"]
          ].map(([label, value]) => (
            <article key={label} className="border border-burgundy/12 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
                {label}
              </p>
              <p className="mt-3 text-xl font-semibold text-ink">{value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
