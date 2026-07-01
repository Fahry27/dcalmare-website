const steps = [
  "Choose your favorite first drop tee.",
  "Select size and quantity on the product page.",
  "Checkout as guest or member.",
  "Scan the dynamic QRIS and pay the exact amount.",
  "Tap Saya Sudah Bayar so admin can verify your payment."
];

export default function HowToOrder() {
  return (
    <section className="bg-cream py-12 md:py-24">
      <div className="container-pad">
        <div className="max-w-2xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            How To Order
          </p>
          <h2 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl md:text-5xl">
            Checkout fast. Pay with QRIS.
          </h2>
        </div>
        <div className="mt-8 grid min-w-0 gap-4 md:mt-10 md:grid-cols-5">
          {steps.map((step, index) => (
            <article key={step} className="min-w-0 border border-burgundy/12 bg-offwhite p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy sm:tracking-[0.22em]">
                0{index + 1}
              </span>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-sm md:leading-6">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
