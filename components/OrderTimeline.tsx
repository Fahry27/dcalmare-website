"use client";

import { ShoppingBag, CreditCard, Truck, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function OrderTimeline({ order }: { order: any }) {
  const [copied, setCopied] = useState(false);

  function handleCopyResi() {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isFailed = order.status === "FAILED";
  const isRefunded = order.status === "REFUNDED";

  // Check step completion
  const step1Complete = true; // Always true once order exists
  const step2Complete = ["PAID", "SHIPPED", "COMPLETED"].includes(order.status);
  const step3Complete = ["SHIPPED", "COMPLETED"].includes(order.status);
  const step4Complete = order.status === "COMPLETED";

  const steps = [
    {
      title: "Pesanan Dibuat",
      description: "Pesanan Anda telah diterima oleh sistem kami.",
      date: new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      icon: ShoppingBag,
      isCompleted: step1Complete,
      isActive: order.status === "PENDING"
    },
    {
      title: "Pembayaran Lunas",
      description: order.status === "PENDING" 
        ? "Menunggu konfirmasi pembayaran otomatis via QRIS." 
        : "Pembayaran telah berhasil kami terima.",
      icon: CreditCard,
      isCompleted: step2Complete,
      isActive: order.status === "PAID"
    },
    {
      title: "Pesanan Dikirim",
      description: order.status === "SHIPPED" || order.status === "COMPLETED"
        ? `Pesanan telah diserahkan ke kurir.`
        : "Pesanan sedang dipersiapkan untuk dikirim.",
      icon: Truck,
      isCompleted: step3Complete,
      isActive: order.status === "SHIPPED"
    },
    {
      title: "Pesanan Selesai",
      description: "Pesanan telah sampai di tujuan dan diterima dengan baik.",
      icon: CheckCircle2,
      isCompleted: step4Complete,
      isActive: order.status === "COMPLETED"
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      {/* Cancellation Warning */}
      {(isFailed || isRefunded) && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-sm rounded-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wider text-xs">Pesanan Dibatalkan</p>
            <p className="mt-1 text-red-700/95">
              {isFailed ? "Mohon maaf, pesanan ini ditandai Gagal atau Dibatalkan." : "Pesanan ini telah di-Refund oleh pihak dCalmare."}
            </p>
          </div>
        </div>
      )}

      {/* Main Timeline (Vertical layout is extremely premium and responsive) */}
      <div className="relative pl-8 border-l border-burgundy/15 ml-4 space-y-8 py-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative">
              {/* Timeline dot */}
              <span className={`absolute -left-[45px] top-0 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                step.isCompleted 
                  ? "bg-green-600 border-green-600 text-white shadow-sm" 
                  : step.isActive 
                    ? "bg-white border-burgundy text-burgundy shadow-sm ring-4 ring-cream/30"
                    : "bg-white border-burgundy/15 text-muted"
              }`}>
                <Icon className="h-4 w-4" />
              </span>

              {/* Step info */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h4 className={`font-serif text-base font-semibold leading-none ${
                    step.isActive ? "text-burgundy" : step.isCompleted ? "text-ink" : "text-muted"
                  }`}>
                    {step.title}
                  </h4>
                  {step.date && step.isCompleted && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted/80">{step.date}</span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed max-w-md">
                  {step.description}
                </p>

                {/* Tracking Details specific to Shipped step */}
                {idx === 2 && (order.status === "SHIPPED" || order.status === "COMPLETED") && order.trackingNumber && (
                  <div className="mt-3 p-4 bg-cream/20 border border-burgundy/10 rounded-sm inline-flex flex-col gap-2 max-w-sm w-full">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted font-medium">JASA EKSPEDISI</span>
                      <span className="font-bold text-burgundy uppercase">{order.courier}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted font-medium">NOMOR RESI</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-ink">
                        <span>{order.trackingNumber}</span>
                        <button 
                          onClick={handleCopyResi}
                          className="p-1 hover:bg-burgundy/5 text-muted hover:text-burgundy rounded transition"
                          title="Salin Resi"
                        >
                          {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
