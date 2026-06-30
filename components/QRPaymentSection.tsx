import SafeImage from "@/components/SafeImage";

export default function QRPaymentSection() {
  return (
    <section className="min-w-0 border border-burgundy/12 bg-white p-4 sm:p-5 md:p-7">
      <div className="flex min-w-0 flex-col gap-6 md:flex-row">
        <div className="relative mx-auto aspect-square w-full max-w-72 shrink-0 overflow-hidden border border-burgundy/10 bg-cream">
          <SafeImage
            src="/payment/gopay-merchant-qr.png"
            alt="GoPay Merchant QR code"
            fill
            sizes="288px"
            className="object-contain p-4"
            fallbackLabel="GoPay Merchant QR"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-burgundy sm:tracking-[0.22em]">
            Pembayaran Manual
          </p>
          <h2 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight text-ink">
            Scan GoPay QR
          </h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-base leading-relaxed text-muted md:text-sm md:leading-6">
            <li>Periksa kembali ringkasan pesanan Anda.</li>
            <li>Lengkapi detail pengiriman.</li>
            <li>Scan QR code GoPay Merchant.</li>
            <li>Selesaikan pembayaran sesuai total pesanan.</li>
            <li>Klik tombol &quot;Saya Sudah Bayar — Konfirmasi ke WhatsApp&quot;.</li>
          </ol>
          <p className="mt-5 break-words border border-burgundy/15 bg-cream px-4 py-3 text-sm font-semibold leading-relaxed text-burgundy">
            Pastikan nominal pembayaran sesuai total pesanan sebelum klik tombol konfirmasi.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted md:leading-6">
            Setelah pembayaran berhasil, klik tombol konfirmasi untuk mengirim
            ringkasan pesanan ke admin melalui WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
