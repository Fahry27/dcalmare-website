import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact dCalmare through WhatsApp, Instagram, or email."
};

export default function ContactPage() {
  return (
    <section className="bg-offwhite py-12 md:py-24">
      <div className="container-pad grid min-w-0 gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            Contact
          </p>
          <h1 className="mt-4 break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
            Need help with your order?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted md:leading-8">
            Reach dCalmare through the channels below. For orders, please
            checkout on the website first so your items, shipping address, and
            QRIS payment amount are recorded correctly.
          </p>
        </div>
        <div className="grid min-w-0 gap-4">
          {[
            ["WhatsApp", "+62 812-3456-7890"],
            ["Instagram", "@dcalmare"],
            ["Email", "hello@dcalmare.com"]
          ].map(([label, value]) => (
            <article key={label} className="min-w-0 border border-burgundy/12 bg-white p-5 sm:p-6">
              <p className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-burgundy sm:tracking-[0.2em]">
                {label}
              </p>
              <p className="mt-3 break-words text-lg font-semibold text-ink sm:text-xl">{value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
