export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "What material do you use?",
    answer:
      "Our first drop uses cotton combed fabric selected for a soft hand feel and everyday comfort."
  },
  {
    question: "How is the fit?",
    answer:
      "Each tee is designed with an oversized, boxy fit. Choose your regular size for a relaxed shape or size down for a neater look."
  },
  {
    question: "How do I order?",
    answer:
      "Choose a product, select your size and quantity, continue to checkout, fill in your delivery details, pay with the GoPay Merchant QR, then confirm through WhatsApp."
  },
  {
    question: "What payment method do you accept?",
    answer:
      "For this MVP, payment is made manually through the GoPay Merchant QR shown on the checkout page."
  },
  {
    question: "Can I pay before confirmation?",
    answer:
      "Please complete the website checkout first so your order summary is ready, then scan the GoPay Merchant QR and confirm through WhatsApp."
  },
  {
    question: "Can I exchange size?",
    answer:
      "Size exchanges are handled manually depending on stock condition and product condition. Contact dCalmare as soon as possible after receiving your order."
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping timing depends on your destination and courier availability. The admin will confirm details after your payment confirmation."
  },
  {
    question: "Do you support Midtrans or automatic checkout?",
    answer:
      "Not yet. This first version keeps payment manual with GoPay Merchant QR and WhatsApp confirmation after checkout."
  }
];
