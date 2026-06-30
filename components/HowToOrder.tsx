const steps = [
  "Choose your favorite first drop tee.",
  "Select size and quantity on the product page.",
  "Fill your delivery details at checkout.",
  "Scan the GoPay Merchant QR and complete payment.",
  "Confirm your paid order to dCalmare via WhatsApp."
];

export default function HowToOrder() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-pad">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
            How To Order
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl">
            Checkout first. WhatsApp after payment.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <article key={step} className="border border-burgundy/12 bg-offwhite p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-burgundy">
                0{index + 1}
              </span>
              <p className="mt-5 text-sm leading-6 text-muted">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
