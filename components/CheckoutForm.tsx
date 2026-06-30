"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRPaymentSection from "@/components/QRPaymentSection";
import { getProductBySlug } from "@/data/products";
import { formatRupiah } from "@/lib/utils";

const ADMIN_WHATSAPP_NUMBER = "6281234567890";

type CheckoutFields = {
  fullName: string;
  whatsapp: string;
  address: string;
  cityDistrict: string;
  postalCode: string;
  notes: string;
};

const initialFields: CheckoutFields = {
  fullName: "",
  whatsapp: "",
  address: "",
  cityDistrict: "",
  postalCode: "",
  notes: ""
};

function parseCheckoutQuantity(value: string | null) {
  if (!value) {
    return null;
  }

  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return null;
  }

  return quantity;
}

function CheckoutErrorState({
  title,
  message
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad">
        <div className="mx-auto max-w-2xl border border-burgundy/12 bg-white p-5 text-center sm:p-8">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-burgundy sm:tracking-[0.22em]">
            Checkout unavailable
          </p>
          <h1 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{message}</p>
          <Link
            href="/shop"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-burgundy px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-burgundy-dark sm:w-auto sm:px-6 sm:tracking-[0.16em]"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const [fields, setFields] = useState<CheckoutFields>(initialFields);

  const productSlug = (searchParams.get("product") ?? "").trim();
  const selectedSize = (searchParams.get("size") ?? "").trim().toUpperCase();
  const quantity = parseCheckoutQuantity(searchParams.get("qty"));
  const product = productSlug ? getProductBySlug(productSlug) : undefined;
  const total = product && quantity ? product.price * quantity : 0;

  const isFormComplete = useMemo(
    () =>
      Boolean(
        fields.fullName.trim() &&
          fields.whatsapp.trim() &&
          fields.address.trim() &&
          fields.cityDistrict.trim() &&
          fields.postalCode.trim()
      ),
    [fields]
  );

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({
      ...current,
      [field]: value
    }));
  }

  function buildWhatsappUrl() {
    if (!product || !quantity) {
      return "";
    }

    const message = `Halo dCalmare, saya sudah melakukan pemesanan dan pembayaran melalui website.

Detail Pesanan:
Nama: ${fields.fullName}
No. WhatsApp: ${fields.whatsapp}
Produk: ${product.name}
Ukuran: ${selectedSize}
Qty: ${quantity}
Harga Satuan: ${formatRupiah(product.price)}
Total: ${formatRupiah(total)}

Alamat Pengiriman:
${fields.address}
${fields.cityDistrict}
${fields.postalCode}

Catatan:
${fields.notes || "-"}

Saya akan kirim bukti pembayaran setelah pesan ini.`;

    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function confirmPayment() {
    const whatsappUrl = buildWhatsappUrl();

    if (!whatsappUrl || !isFormComplete) {
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (!productSlug) {
    return (
      <CheckoutErrorState
        title="Product is missing."
        message="This checkout link does not include a product. Please choose an item from the shop before checking out."
      />
    );
  }

  if (!product) {
    return (
      <CheckoutErrorState
        title="Product not found."
        message="This checkout link references a product that is not available in the dCalmare catalog."
      />
    );
  }

  if (!selectedSize) {
    return (
      <CheckoutErrorState
        title="Size is missing."
        message="This checkout link does not include a selected size. Please return to the product page and choose a size."
      />
    );
  }

  if (!product.sizes.includes(selectedSize)) {
    return (
      <CheckoutErrorState
        title="Size is not available."
        message="The selected size is not available for this product. Please choose an available size from the product page."
      />
    );
  }

  if (!quantity) {
    return (
      <CheckoutErrorState
        title="Quantity is invalid."
        message="This checkout link has an invalid quantity. Please choose a quantity of at least 1 from the product page."
      />
    );
  }

  return (
    <section className="bg-offwhite py-8 md:py-16">
      <div className="container-pad">
        <div className="max-w-3xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            Checkout
          </p>
          <h1 className="mt-4 break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
            Complete your order.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted md:leading-8">
            Fill your delivery details, scan the GoPay Merchant QR, then confirm
            the paid order to dCalmare admin via WhatsApp.
          </p>
        </div>

        <div className="mt-8 grid min-w-0 gap-6 lg:mt-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="min-w-0 border border-burgundy/12 bg-white p-4 sm:p-5 md:p-7 lg:sticky lg:top-28">
            <h2 className="break-words font-serif text-3xl font-semibold leading-tight text-ink">
              Order summary
            </h2>
            <dl className="mt-6 grid gap-4 text-sm">
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Product name</dt>
                <dd className="break-words text-right font-semibold text-ink">{product.name}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Size</dt>
                <dd className="text-right font-semibold text-ink">{selectedSize}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Quantity</dt>
                <dd className="text-right font-semibold text-ink">{quantity}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Unit price</dt>
                <dd className="text-right font-semibold text-ink">
                  {formatRupiah(product.price)}
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-t border-burgundy/10 pt-4 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-right font-semibold text-burgundy">{formatRupiah(total)}</dd>
              </div>
            </dl>
          </aside>

          <div className="grid min-w-0 gap-6">
            <form className="min-w-0 border border-burgundy/12 bg-white p-4 sm:p-5 md:p-7">
              <h2 className="break-words font-serif text-3xl font-semibold leading-tight text-ink">
                Delivery details
              </h2>
              <div className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Full name
                  <input
                    type="text"
                    value={fields.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  WhatsApp number
                  <input
                    type="tel"
                    value={fields.whatsapp}
                    onChange={(event) => updateField("whatsapp", event.target.value)}
                    className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                    autoComplete="tel"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Full address
                  <textarea
                    value={fields.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    className="min-h-28 w-full resize-y border border-burgundy/15 bg-offwhite px-4 py-3 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                    required
                  />
                </label>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    City / District
                    <input
                      type="text"
                      value={fields.cityDistrict}
                      onChange={(event) =>
                        updateField("cityDistrict", event.target.value)
                      }
                      className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Postal code
                    <input
                      type="text"
                      value={fields.postalCode}
                      onChange={(event) =>
                        updateField("postalCode", event.target.value)
                      }
                      className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                      autoComplete="postal-code"
                      required
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Order notes optional
                  <textarea
                    value={fields.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className="min-h-24 w-full resize-y border border-burgundy/15 bg-offwhite px-4 py-3 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                  />
                </label>
              </div>
            </form>

            <QRPaymentSection />

            <div className="grid gap-3">
              {!isFormComplete ? (
                <p className="text-center text-sm font-medium text-burgundy">
                  Please fill all required delivery details to continue.
                </p>
              ) : null}
              <button
                type="button"
                disabled={!isFormComplete}
                onClick={confirmPayment}
                className="min-h-14 w-full bg-burgundy px-4 py-3 text-center text-sm font-semibold uppercase leading-5 tracking-[0.04em] text-white transition hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:bg-muted/35 disabled:text-white sm:px-6 sm:tracking-[0.14em]"
              >
                Saya Sudah Bayar — Konfirmasi ke WhatsApp
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-muted">
              <p>Manual payment verification by dCalmare team.</p>
              <p className="mt-1">Please prepare payment proof before confirming through WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
