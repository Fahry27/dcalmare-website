"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function updateStatus(status: string) {
    let message = "";
    if (status === "PAID") message = "Apakah Anda yakin pembayaran sudah diterima?";
    if (status === "FAILED") message = "Tandai pesanan ini sebagai GAGAL?";
    if (status === "REFUNDED") message = "Tandai pesanan ini sebagai di-REFUND?";

    if (!confirm(message)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
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

  return (
    <div className="flex gap-2 flex-wrap">
      {currentStatus === "PENDING" && (
        <>
          <button
            onClick={() => updateStatus("PAID")}
            disabled={isLoading}
            className="bg-green-600 text-white px-3 py-1 text-xs font-semibold uppercase rounded hover:bg-green-700 disabled:opacity-50"
          >
            Lunas
          </button>
          <button
            onClick={() => updateStatus("FAILED")}
            disabled={isLoading}
            className="bg-red-600 text-white px-3 py-1 text-xs font-semibold uppercase rounded hover:bg-red-700 disabled:opacity-50"
          >
            Gagal
          </button>
        </>
      )}
      {currentStatus === "PAID" && (
        <button
          onClick={() => updateStatus("REFUNDED")}
          disabled={isLoading}
          className="bg-gray-600 text-white px-3 py-1 text-xs font-semibold uppercase rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Refund
        </button>
      )}
    </div>
  );
}
