"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { formatRupiah } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { useCartStore } from "@/store/useCartStore";
import SafeImage from "./SafeImage";
import { Check, Clock3, Copy, CreditCard, ShieldCheck, Timer } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

import { POPULAR_CITIES } from "@/data/cities";

type CheckoutFields = {
  fullName: string;
  whatsapp: string;
  address: string;
  manualAddress: string;
  notes: string;
  destinationCityId: string;
  courier: string;
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
    notes: "",
    destinationCityId: "",
    courier: ""
  });
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedValue, setCopiedValue] = useState<"order" | "qris" | null>(null);
  const [orderState, setOrderState] = useState<{ id: string; qrisString: string; status: string; amount: number; baseAmount?: number; uniqueCode?: number } | null>(null);

  const isFormComplete = useMemo(
    () =>
      Boolean(
        fields.fullName.trim() &&
          fields.whatsapp.trim() &&
          fields.destinationCityId &&
          fields.courier &&
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

  // Calculate shipping cost whenever city or courier changes
  useEffect(() => {
    async function calculateShipping() {
      if (!fields.destinationCityId || !fields.courier) {
        setShippingCost(0);
        return;
      }
      setIsCalculatingShipping(true);
      try {
        const res = await fetch("/api/ongkir/cost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destinationCityId: fields.destinationCityId,
            courier: fields.courier,
            weightGrams: cartItems.reduce((total, item) => total + (item.quantity * 250), 0) || 1000
          })
        });
        if (res.ok) {
          const data = await res.json();
          setShippingCost(data.cost || 0);
        } else {
          setShippingCost(0);
        }
      } catch (err) {
        console.error("Failed to calculate shipping", err);
        setShippingCost(0);
      } finally {
        setIsCalculatingShipping(false);
      }
    }
    calculateShipping();
  }, [fields.destinationCityId, fields.courier, cartItems]);

  async function createOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormComplete || cartItems.length === 0) return;
    
    setIsLoading(true);
    const selectedCity = POPULAR_CITIES.find(c => c.city_id === fields.destinationCityId);
    const finalAddress = `${fields.manualAddress}\n\nKota/Kab: ${selectedCity?.city_name || ""} (${selectedCity?.province || ""})\nKodepos: ${selectedCity?.postal_code || ""}\n\n(Peta: ${fields.address})`;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          address: finalAddress,
          shippingCost,
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
          status: "PENDING",
          amount: data.amount,
          baseAmount: data.baseAmount,
          uniqueCode: data.uniqueCode
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

  async function confirmPayment() {
    if (!orderState) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderState.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm-payment" })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderState((prev) => prev ? { ...prev, status: data.status || "WAITING_CONFIRMATION" } : null);
      } else {
        alert("Konfirmasi pembayaran gagal diproses.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard(value: string, type: "order" | "qris") {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(type);
      setTimeout(() => setCopiedValue(null), 1800);
    } catch (err) {
      console.error("Failed to copy payment data", err);
      alert("Gagal menyalin. Silakan salin manual.");
    }
  }

  // Polling for order status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderState && ["PENDING", "WAITING_CONFIRMATION"].includes(orderState.status)) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/${orderState.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status !== orderState.status) {
              setOrderState(prev => prev ? { ...prev, status: data.status } : null);
              if (!["PENDING", "WAITING_CONFIRMATION"].includes(data.status)) {
                clearInterval(interval);
              }
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

    const isWaitingConfirmation = orderState.status === "WAITING_CONFIRMATION";

    return (
      <section className="bg-offwhite py-8 md:py-16">
        <div className="container-pad">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-3 border-b border-burgundy/10 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
                  Pembayaran QRIS
                </p>
                <h1 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">
                  Selesaikan pembayaran.
                </h1>
              </div>
              <div className="inline-flex w-fit items-center gap-2 border border-burgundy/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {isWaitingConfirmation ? <ShieldCheck className="h-4 w-4 text-burgundy" /> : <Clock3 className="h-4 w-4 text-burgundy" />}
                {isWaitingConfirmation ? "Menunggu Verifikasi" : "Menunggu Pembayaran"}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-start">
              <div className="border border-burgundy/12 bg-white p-5 sm:p-7">
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-sm border border-burgundy/10 bg-offwhite p-4 sm:p-5">
                    <div className="bg-white p-3">
                      <QRCodeSVG value={orderState.qrisString} size={280} className="mx-auto h-auto max-w-full" />
                    </div>
                  </div>

                  <div className="mt-6 w-full max-w-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Total yang harus dibayar
                    </p>
                    <p className="mt-2 break-words font-serif text-4xl font-semibold leading-tight text-burgundy sm:text-5xl">
                      {formatRupiah(orderState.amount)}
                    </p>
                    {orderState.baseAmount && orderState.uniqueCode ? (
                      <div className="mt-4 grid gap-2 border border-yellow-200 bg-yellow-50 p-4 text-left text-xs leading-relaxed text-yellow-900 sm:grid-cols-2">
                        <div>
                          <p className="font-semibold uppercase tracking-[0.12em]">Subtotal</p>
                          <p className="mt-1 font-bold">{formatRupiah(orderState.baseAmount)}</p>
                        </div>
                        <div>
                          <p className="font-semibold uppercase tracking-[0.12em]">Kode Unik</p>
                          <p className="mt-1 font-bold">+{orderState.uniqueCode}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                    {orderState.status === "PENDING" ? (
                      <button
                        type="button"
                        onClick={confirmPayment}
                        disabled={isLoading}
                        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-burgundy px-5 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:bg-muted/40"
                      >
                        <CreditCard className="h-4 w-4" />
                        {isLoading ? "Memproses..." : "Saya Sudah Bayar"}
                      </button>
                    ) : (
                      <div className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-burgundy/15 bg-cream/30 px-5 text-center text-sm font-semibold uppercase tracking-[0.08em] text-burgundy">
                        <ShieldCheck className="h-4 w-4" />
                        Sedang Dicek Admin
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(orderState.qrisString, "qris")}
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-burgundy/15 bg-white px-5 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-burgundy hover:text-burgundy"
                    >
                      {copiedValue === "qris" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      {copiedValue === "qris" ? "Tersalin" : "Salin QRIS"}
                    </button>
                  </div>
                </div>
              </div>

              <aside className="grid gap-4">
                <div className="border border-burgundy/12 bg-white p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-burgundy text-white">
                      <Timer className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">
                        Instruksi
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        Scan QRIS, bayar sesuai nominal unik, lalu tekan tombol konfirmasi setelah pembayaran berhasil dari aplikasi Anda.
                      </p>
                    </div>
                  </div>

                  <ol className="mt-5 grid gap-3 text-sm text-ink">
                    {["Buka m-banking atau e-wallet yang mendukung QRIS.", "Scan kode QR dan pastikan nominal sama persis.", "Simpan bukti pembayaran sampai status berubah lunas."].map((step, index) => (
                      <li key={step} className="flex gap-3 border-t border-burgundy/10 pt-3 first:border-t-0 first:pt-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-cream text-xs font-bold text-burgundy">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed text-muted">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="border border-burgundy/12 bg-white p-5 sm:p-6">
                  <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">
                    Detail Pesanan
                  </h2>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-burgundy/10 pb-3">
                      <dt className="text-muted">Order ID</dt>
                      <dd className="flex min-w-0 items-center gap-2 font-mono text-xs font-bold text-ink">
                        <span className="truncate">{orderState.id}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(orderState.id, "order")}
                          className="shrink-0 p-1 text-muted transition hover:text-burgundy"
                          title="Salin Order ID"
                        >
                          {copiedValue === "order" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-burgundy/10 pb-3">
                      <dt className="text-muted">Status</dt>
                      <dd className="font-semibold text-burgundy">
                        {isWaitingConfirmation ? "Cek mutasi admin" : "Belum dikonfirmasi"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Metode</dt>
                      <dd className="font-semibold text-ink">QRIS Dinamis</dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
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
            Isi detail pengiriman untuk memproses pesanan dan membuat QRIS dinamis sesuai total pembayaran.
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

            <dl className="mt-6 grid gap-3 text-sm border-t border-burgundy/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal Produk</dt>
                <dd className="font-semibold text-ink">{formatRupiah(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Ongkos Kirim</dt>
                <dd className="font-semibold text-ink">
                  {isCalculatingShipping ? (
                    <span className="text-xs text-muted animate-pulse">Menghitung...</span>
                  ) : (
                    formatRupiah(shippingCost)
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-burgundy/10 pt-3 text-base font-bold">
                <dt className="text-ink">Total Pembayaran</dt>
                <dd className="text-burgundy">{formatRupiah(cartTotal + shippingCost)}</dd>
              </div>
            </dl>
          </aside>

          <div className="grid min-w-0 gap-6">
            <div className="min-w-0 border border-burgundy/12 bg-white p-4 sm:p-5 md:p-7">
              <h2 className="break-words font-serif text-3xl font-semibold leading-tight text-ink">
                Detail pengiriman
              </h2>
              <div className="mt-6 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
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
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Kota / Kabupaten Tujuan
                    <select
                      value={fields.destinationCityId}
                      onChange={(e) => updateField("destinationCityId", e.target.value)}
                      className="min-h-12 w-full border border-burgundy/15 bg-white px-4 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                      required
                    >
                      <option value="">-- Pilih Kota / Kabupaten --</option>
                      {POPULAR_CITIES.map((city) => (
                        <option key={city.city_id} value={city.city_id}>
                          {city.city_name} ({city.province})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Jasa Pengiriman (Kurir)
                    <select
                      value={fields.courier}
                      onChange={(e) => updateField("courier", e.target.value)}
                      className="min-h-12 w-full border border-burgundy/15 bg-white px-4 text-base font-normal outline-none transition focus:border-burgundy sm:text-sm"
                      required
                    >
                      <option value="">-- Pilih Kurir --</option>
                      <option value="JNE">JNE (Jalur Nugraha Ekakurir)</option>
                      <option value="POS">POS Indonesia</option>
                      <option value="TIKI">TIKI (Titipan Kilat)</option>
                    </select>
                  </label>
                </div>
                
                <div className="grid gap-2">
                  <span className="text-sm font-semibold text-ink">Peta Akurasi Koordinat (Opsional)</span>
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
