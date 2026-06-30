import Link from "next/link";
import { faqs } from "@/data/faqs";

type FAQSectionProps = {
  limit?: number;
  showLink?: boolean;
};

export default function FAQSection({ limit, showLink = false }: FAQSectionProps) {
  const visibleFaqs = typeof limit === "number" ? faqs.slice(0, limit) : faqs;

  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
              FAQ
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Before you order
            </h2>
          </div>
          {showLink ? (
            <Link
              href="/faq"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-burgundy transition hover:text-burgundy-soft"
            >
              View all FAQ
            </Link>
          ) : null}
        </div>
        <div className="mt-10 grid gap-4">
          {visibleFaqs.map((faq) => (
            <details key={faq.question} className="group border border-burgundy/12 bg-white p-5">
              <summary className="cursor-pointer list-none text-base font-semibold text-ink">
                <span className="inline-flex w-full items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-burgundy transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
