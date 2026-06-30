import SafeImage from "@/components/SafeImage";

export default function QRPaymentSection() {
  return (
    <section className="border border-burgundy/12 bg-white p-5 md:p-7">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative mx-auto aspect-square w-full max-w-72 border border-burgundy/10 bg-cream">
          <SafeImage
            src="/payment/gopay-merchant-qr.png"
            alt="GoPay Merchant QR code"
            fill
            sizes="288px"
            className="object-contain p-4"
            fallbackLabel="GoPay Merchant QR"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-burgundy">
            Manual Payment
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">
            Scan GoPay Merchant QR
          </h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
            <li>Check your order summary.</li>
            <li>Fill in your delivery details.</li>
            <li>Scan the GoPay Merchant QR code.</li>
            <li>Complete your payment.</li>
            <li>Click “Saya Sudah Bayar — Konfirmasi ke WhatsApp”.</li>
          </ol>
          <p className="mt-5 border border-burgundy/15 bg-cream px-4 py-3 text-sm font-semibold text-burgundy">
            Please complete payment before clicking the confirmation button.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Setelah pembayaran berhasil, klik tombol konfirmasi untuk mengirim
            ringkasan pesanan ke admin dCalmare melalui WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
