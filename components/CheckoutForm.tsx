"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getProductBySlug } from "@/data/products";
import { formatRupiah } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

type CheckoutFields = {
  fullName: string;
  whatsapp: string;
  address: string;
  notes: string;
};

const initialFields: CheckoutFields = {
  fullName: "",
  whatsapp: "",
  address: "",
  notes: ""
};

function parseCheckoutQuantity(value: string | null) {
  if (!value) return null;
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1) return null;
  return quantity;
}

function CheckoutErrorState({ title, message }: { title: string; message: string; }) {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad">
        <div className="mx-auto max-w-2xl border border-burgundy/12 bg-white p-5 text-center sm:p-8">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-burgundy sm:tracking-[0.22em]">
            Checkout Tidak Tersedia
          </p>
          <h1 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{message}</p>
          <Link
            href="/shop"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-burgundy px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-burgundy-dark sm:w-auto sm:px-6 sm:tracking-[0.16em]"
          >
            Kembali ke katalog
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const [fields, setFields] = useState<CheckoutFields>(initialFields);
  const [isLoading, setIsLoading] = useState(false);
  const [orderState, setOrderState] = useState<{ id: string; qrisString: string; status: string } | null>(null);

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
          fields.address.trim()
      ),
    [fields]
  );

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function createOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormComplete || !product || !quantity) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          productSlug,
          selectedSize,
          quantity
        })
      });
      const data = await res.json();
      if (res.ok && data.qrisString) {
        setOrderState({
          id: data.orderId,
          qrisString: data.qrisString,
          status: "PENDING"
        });
      } else {
        alert("Terjadi kesalahan saat memproses pesanan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  }

  // Polling for order status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderState && orderState.status === "PENDING") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/${orderState.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status !== "PENDING") {
              setOrderState(prev => prev ? { ...prev, status: data.status } : null);
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [orderState]);

  if (!productSlug || !product || !selectedSize || !product.sizes.includes(selectedSize) || !quantity) {
    return (
      <CheckoutErrorState
        title="Checkout Tidak Valid"
        message="Data produk, ukuran, atau jumlah tidak valid. Silakan kembali ke katalog."
      />
    );
  }

  if (orderState) {
    if (orderState.status === "PAID") {
      return (
        <section className="bg-offwhite py-16 md:py-24">
          <div className="container-pad">
            <div className="mx-auto max-w-2xl border border-burgundy/12 bg-white p-5 text-center sm:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="break-words font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Pembayaran Berhasil!
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Terima kasih atas pesanan Anda. Kami akan segera memproses dan mengirimkan pesanan ke alamat tujuan.
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-burgundy px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-burgundy-dark sm:w-auto sm:px-6 sm:tracking-[0.16em]"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </section>
      );
    }

    if (orderState.status === "FAILED" || orderState.status === "REFUNDED") {
      return (
        <section className="bg-offwhite py-16 md:py-24">
          <div className="container-pad">
            <div className="mx-auto max-w-2xl border border-burgundy/12 bg-white p-5 text-center sm:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="break-words font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Pembayaran {orderState.status === "FAILED" ? "Gagal" : "Di-Refund"}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Pesanan Anda telah dibatalkan oleh Admin. Silakan hubungi kami jika Anda memiliki pertanyaan atau kendala.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-burgundy px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-burgundy-dark sm:w-auto sm:px-6 sm:tracking-[0.16em]"
              >
                Kembali ke Katalog
              </Link>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-offwhite py-8 md:py-16">
        <div className="container-pad">
          <div className="mx-auto max-w-xl border border-burgundy/12 bg-white p-6 sm:p-10 text-center">
            <h1 className="break-words font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl mb-4">
              Selesaikan Pembayaran
            </h1>
            <p className="text-muted mb-8">
              Silakan scan QRIS di bawah ini menggunakan aplikasi m-banking atau e-wallet (GoPay, OVO, Dana, dll). Nominal sudah terisi otomatis (Dinamis).
            </p>
            <div className="bg-white p-4 border border-burgundy/15 rounded-lg inline-block shadow-sm">
              <QRCodeSVG value={orderState.qrisString} size={256} className="mx-auto" />
            </div>
            <p className="mt-6 text-xl font-semibold text-burgundy">{formatRupiah(total)}</p>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted">
              <svg className="animate-spin h-5 w-5 text-burgundy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menunggu konfirmasi pembayaran...
            </div>
            <p className="mt-4 text-xs text-muted/80">
              Order ID: {orderState.id}
            </p>
          </div>
        </div>
      </section>
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
            Selesaikan pesanan.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted md:leading-8">
            Isi detail pengiriman untuk memproses pesanan dan membuat kode QR pembayaran otomatis.
          </p>
        </div>

        <form onSubmit={createOrder} className="mt-8 grid min-w-0 gap-6 lg:mt-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="min-w-0 border border-burgundy/12 bg-white p-4 sm:p-5 md:p-7 lg:sticky lg:top-28">
            <h2 className="break-words font-serif text-3xl font-semibold leading-tight text-ink">
              Ringkasan pesanan
            </h2>
            <dl className="mt-6 grid gap-4 text-sm">
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Nama Produk</dt>
                <dd className="break-words text-right font-semibold text-ink">{product.name}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Ukuran</dt>
                <dd className="text-right font-semibold text-ink">{selectedSize}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Jumlah</dt>
                <dd className="text-right font-semibold text-ink">{quantity}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                <dt className="text-muted">Harga Satuan</dt>
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
            <div className="min-w-0 border border-burgundy/12 bg-white p-4 sm:p-5 md:p-7">
              <h2 className="break-words font-serif text-3xl font-semibold leading-tight text-ink">
                Detail pengiriman
              </h2>
              <div className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Nama Lengkap
                  <input
                    type="text"
                    value={fields.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="Nama sesuai identitas"
                    className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base font-normal outline-none transition focus:border-burgundy placeholder:text-muted/60 sm:text-sm"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Nomor WhatsApp
                  <input
                    type="tel"
                    value={fields.whatsapp}
                    onChange={(event) => updateField("whatsapp", event.target.value)}
                    placeholder="08..."
                    className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base font-normal outline-none transition focus:border-burgundy placeholder:text-muted/60 sm:text-sm"
                    autoComplete="tel"
                    required
                  />
                </label>
                
                <div className="grid gap-2">
                  <span className="text-sm font-semibold text-ink">Pilih Lokasi Pengiriman di Peta</span>
                  <MapPicker onLocationSelect={(addr) => updateField("address", addr)} />
                </div>

                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Alamat Lengkap (Otomatis dari Peta)
                  <textarea
                    value={fields.address}
                    readOnly
                    placeholder="Geser pin di peta untuk mengisi alamat..."
                    className="min-h-20 w-full resize-y border border-burgundy/15 bg-gray-100 px-4 py-3 text-base font-normal outline-none cursor-not-allowed sm:text-sm text-muted"
                    required
                  />
                </label>
                
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Catatan Patokan (Wajib diisi)
                  <textarea
                    value={fields.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    placeholder="Contoh: Rumah pagar hitam depan masjid, atas nama Budi"
                    className="min-h-24 w-full resize-y border border-burgundy/15 bg-offwhite px-4 py-3 text-base font-normal outline-none transition focus:border-burgundy placeholder:text-muted/60 sm:text-sm"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-3">
              {!isFormComplete ? (
                <p className="text-center text-sm font-medium text-burgundy">
                  Harap lengkapi semua detail pengiriman untuk melanjutkan.
                </p>
              ) : null}
              <button
                type="submit"
                disabled={!isFormComplete || isLoading}
                className="min-h-14 w-full bg-burgundy px-4 py-3 text-center text-sm font-semibold uppercase leading-5 tracking-[0.04em] text-white transition hover:bg-burgundy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-muted/35 disabled:text-white sm:px-6 sm:tracking-[0.14em]"
              >
                {isLoading ? "Memproses..." : "Buat Pesanan & Bayar via QRIS"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
