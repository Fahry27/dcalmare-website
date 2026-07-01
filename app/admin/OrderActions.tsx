"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderActions({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function markAsPaid() {
    if (!confirm("Apakah Anda yakin pembayaran sudah diterima untuk pesanan ini?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" })
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
    <button
      onClick={markAsPaid}
      disabled={isLoading}
      className="bg-burgundy text-white px-3 py-1 text-xs font-semibold uppercase rounded hover:bg-burgundy-dark disabled:opacity-50"
    >
      {isLoading ? "Loading..." : "Konfirmasi Lunas"}
    </button>
  );
}
