"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, CheckCircle2, RotateCcw, XCircle, DollarSign } from "lucide-react";

export default function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showShippedModal, setShowShippedModal] = useState(false);
  const [courier, setCourier] = useState("JNE");
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  async function updateStatus(status: string, additionalData = {}) {
    let message = "";
    if (status === "PAID") message = "Apakah Anda yakin pembayaran sudah diterima?";
    if (status === "COMPLETED") message = "Tandai pesanan ini sebagai SELESAI?";
    if (status === "FAILED") message = "Tandai pesanan ini sebagai GAGAL / BATAL?";
    if (status === "REFUNDED") message = "Tandai pesanan ini sebagai di-REFUND?";

    if (status !== "SHIPPED" && !confirm(message)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...additionalData })
      });
      if (res.ok) {
        setShowShippedModal(false);
        router.refresh();
      } else {
        alert("Gagal mengupdate status.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleShippedSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courier.trim() || !trackingNumber.trim()) {
      alert("Harap isi nama kurir dan nomor resi!");
      return;
    }
    updateStatus("SHIPPED", { courier, trackingNumber });
  }

  return (
    <div className="flex gap-1.5 flex-wrap justify-end">
      {/* PENDING / WAITING_CONFIRMATION -> PAID */}
      {(currentStatus === "PENDING" || currentStatus === "WAITING_CONFIRMATION") && (
        <>
          <button
            onClick={() => updateStatus("PAID")}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 text-xs font-bold uppercase rounded-sm flex items-center gap-1 transition disabled:opacity-50"
            title="Tandai Lunas"
          >
            <DollarSign className="h-3 w-3" />
            <span>Lunas</span>
          </button>
          <button
            onClick={() => updateStatus("FAILED")}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 text-xs font-bold uppercase rounded-sm flex items-center gap-1 transition disabled:opacity-50"
            title="Tandai Gagal"
          >
            <XCircle className="h-3 w-3" />
            <span>Gagal</span>
          </button>
        </>
      )}

      {/* PAID -> SHIPPED */}
      {currentStatus === "PAID" && (
        <>
          <button
            onClick={() => setShowShippedModal(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-xs font-bold uppercase rounded-sm flex items-center gap-1 transition disabled:opacity-50"
            title="Kirim Pesanan (Input Resi)"
          >
            <Truck className="h-3 w-3" />
            <span>Kirim</span>
          </button>
          <button
            onClick={() => updateStatus("REFUNDED")}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-2.5 py-1 text-xs font-bold uppercase rounded-sm flex items-center gap-1 transition disabled:opacity-50"
            title="Tandai Refund"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Refund</span>
          </button>
        </>
      )}

      {/* SHIPPED -> COMPLETED */}
      {currentStatus === "SHIPPED" && (
        <button
          onClick={() => updateStatus("COMPLETED")}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 text-xs font-bold uppercase rounded-sm flex items-center gap-1 transition disabled:opacity-50"
          title="Tandai Selesai"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Selesai</span>
        </button>
      )}

      {/* Shipped Input Modal */}
      {showShippedModal && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-burgundy/15 p-6 max-w-sm w-full shadow-lg rounded-sm text-left">
            <h3 className="font-serif text-lg font-bold text-ink mb-4">Input Resi Pengiriman</h3>
            
            <form onSubmit={handleShippedSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Kurir</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full border border-burgundy/15 bg-offwhite px-3 py-2 text-sm outline-none transition focus:border-burgundy"
                >
                  <option value="JNE">JNE</option>
                  <option value="J&T">J&T</option>
                  <option value="SiCepat">SiCepat</option>
                  <option value="POS Indonesia">POS Indonesia</option>
                  <option value="TIKI">TIKI</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Nomor Resi</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Contoh: JP123456789"
                  className="w-full border border-burgundy/15 bg-offwhite px-3 py-2 text-sm outline-none transition focus:border-burgundy"
                  required
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowShippedModal(false)}
                  className="flex-1 border border-burgundy/20 py-2 text-xs font-bold uppercase hover:bg-cream/25 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-burgundy hover:bg-burgundy-dark text-white py-2 text-xs font-bold uppercase transition"
                >
                  {isLoading ? "Proses..." : "Simpan & Kirim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
