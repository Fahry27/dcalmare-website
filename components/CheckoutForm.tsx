"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { formatRupiah } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { useCartStore } from "@/store/useCartStore";
import SafeImage from "./SafeImage";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

type CheckoutFields = {
  fullName: string;
  whatsapp: string;
  address: string;
  manualAddress: string;
  notes: string;
};

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

export default function CheckoutForm({ initialUser }: { initialUser?: any }) {
  const router = useRouter();
  
  // Hydration safety for zustand
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getTotalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const [fields, setFields] = useState<CheckoutFields>({
    fullName: initialUser?.name || "",
    whatsapp: initialUser?.phone || "",
    address: "",
    manualAddress: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderState, setOrderState] = useState<{ id: string; qrisString: string; status: string } | null>(null);

  const isFormComplete = useMemo(
    () =>
      Boolean(
        fields.fullName.trim() &&
          fields.whatsapp.trim() &&
          fields.address.trim() &&
          fields.manualAddress.trim()
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
    if (!isFormComplete || cartItems.length === 0) return;
    
    setIsLoading(true);
    const finalAddress = `${fields.manualAddress}\n\n(Area dari Peta: ${fields.address})`;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          address: finalAddress,
          items: cartItems.map(item => ({
            productSlug: item.product.slug,
            productName: item.product.name,
            size: item.size,
            quantity: item.quantity,
            price: item.product.price
          }))
        })
      });
      const data = await res.json();
      if (res.ok && data.qrisString) {
        setOrderState({
          id: data.orderId,
          qrisString: data.qrisString,
          status: "PENDING"
        });
        clearCart(); // Clear cart after order is created successfully
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

  if (!mounted) return null;

  if (cartItems.length === 0 && !orderState) {
    return (
      <CheckoutErrorState
        title="Keranjang Kosong"
        message="Anda belum menambahkan produk apa pun ke keranjang. Silakan kembali berbelanja."
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
                href="/tracking"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-burgundy px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-burgundy-dark sm:w-auto sm:px-6 sm:tracking-[0.16em]"
              >
                Lacak Pesanan Saya
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
              Silakan scan QRIS di bawah ini menggunakan aplikasi m-banking atau e-wallet (GoPay, OVO, Dana, dll).
            </p>
            <div className="bg-white p-4 border border-burgundy/15 rounded-lg inline-block shadow-sm">
              <QRCodeSVG value={orderState.qrisString} size={256} className="mx-auto" />
            </div>
            <p className="mt-6 text-xl font-semibold text-burgundy">{formatRupiah(cartTotal)}</p>
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
            <h2 className="break-words font-serif text-3xl font-semibold leading-tight text-ink mb-6">
              Ringkasan pesanan
            </h2>
            
            <div className="flex flex-col gap-4 border-b border-burgundy/10 pb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 bg-offwhite">
                    <SafeImage src={item.product.image} alt={item.product.name} fill className="object-cover" fallbackLabel={item.product.name} />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted">Size: {item.size} x {item.quantity}</p>
                    <p className="mt-1 text-sm font-semibold text-burgundy">{formatRupiah(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <dl className="mt-6 grid gap-4 text-sm">
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-right font-semibold text-burgundy">{formatRupiah(cartTotal)}</dd>
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
                    onChange={(event) => updateField("whatsapp", event.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 081234567890"
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
                  Area Lokasi Peta (Otomatis dari Peta)
                  <textarea
                    value={fields.address}
                    readOnly
                    placeholder="Geser pin di peta untuk mengisi alamat..."
                    className="min-h-20 w-full resize-y border border-burgundy/15 bg-gray-100 px-4 py-3 text-base font-normal outline-none cursor-not-allowed sm:text-sm text-muted"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Alamat Lengkap (Ketik Manual) <span className="text-burgundy">*Wajib Diisi</span>
                  <textarea
                    value={fields.manualAddress}
                    onChange={(event) => updateField("manualAddress", event.target.value)}
                    placeholder="Contoh: Jalan Kerosin 1 No. 11, RT 01 / RW 02. Patokan: Rumah pagar hitam."
                    className="min-h-20 w-full resize-y border border-burgundy/15 bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-burgundy placeholder:text-muted/60 sm:text-sm"
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
