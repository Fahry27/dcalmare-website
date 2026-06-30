import Link from "next/link";
import { faqs } from "@/data/faqs";

type FAQSectionProps = {
  limit?: number;
  showLink?: boolean;
};

export default function FAQSection({ limit, showLink = false }: FAQSectionProps) {
  const visibleFaqs = typeof limit === "number" ? faqs.slice(0, limit) : faqs;

  return (
    <section className="bg-offwhite py-12 md:py-24">
      <div className="container-pad">
        <div className="flex min-w-0 flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
              FAQ
            </p>
            <h2 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl md:text-5xl">
              Before you order
            </h2>
          </div>
          {showLink ? (
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:text-burgundy-soft sm:tracking-[0.18em]"
            >
              View all FAQ
            </Link>
          ) : null}
        </div>
        <div className="mt-8 grid min-w-0 md:mt-10">
          <div className="border-t border-burgundy/20">
            {visibleFaqs.map((faq) => (
              <details key={faq.question} className="group min-w-0 border-b border-burgundy/20 py-4 sm:py-6">
                <summary className="cursor-pointer list-none text-base font-semibold text-ink outline-none transition-colors hover:text-burgundy focus-visible:text-burgundy">
                  <span className="inline-flex min-h-8 w-full min-w-0 items-center justify-between gap-4">
                    <span className="min-w-0 break-words">{faq.question}</span>
                    <span className="shrink-0 text-xl font-light text-burgundy transition-transform duration-300 group-open:rotate-45">+</span>
                  </span>
                </summary>
                <div className="overflow-hidden">
                  <p className="mt-4 max-w-3xl pr-8 text-base leading-relaxed text-muted md:text-sm md:leading-7">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
