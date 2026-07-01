"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import OrderActions from "./OrderActions";
import { ChevronDown, ChevronUp, MapPin, Clipboard, FileText, Truck } from "lucide-react";

export default function OrderRow({ order }: { order: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let items = [];
  try {
    items = JSON.parse(order.productSlug);
  } catch (e) {
    items = [{
      name: order.productSlug.replace(/-/g, " "),
      size: order.productSize,
      qty: order.quantity,
      price: (order.amount - order.shippingCost) / order.quantity
    }];
  }

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className="border-b border-burgundy/5 hover:bg-cream/20 cursor-pointer transition"
      >
        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted">
          {new Date(order.createdAt).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </td>
        <td className="px-6 py-4">
          <p className="font-semibold text-ink">{order.customerName}</p>
          <p className="text-xs text-muted">{order.customerPhone}</p>
        </td>
        <td className="px-6 py-4 text-xs font-medium">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="mb-0.5 last:mb-0">
              {it.name} ({it.size}) x {it.qty || it.quantity}
            </div>
          ))}
        </td>
        <td className="px-6 py-4 text-xs font-semibold text-ink">
          {order.shippingCost > 0 ? formatRupiah(order.shippingCost) : "Gratis"}
          {order.courier && <span className="block text-[10px] text-muted font-normal uppercase">{order.courier}</span>}
        </td>
        <td className="px-6 py-4 font-bold text-burgundy">
          {formatRupiah(order.amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-sm ${
            order.status === "PAID" ? "bg-green-100 text-green-800" : 
            order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
            order.status === "COMPLETED" ? "bg-teal-100 text-teal-800" :
            order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}>
            {order.status}
          </span>
        </td>
        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-3">
            <OrderActions orderId={order.id} currentStatus={order.status} />
            <button className="text-muted hover:text-burgundy">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="bg-offwhite/40">
          <td colSpan={7} className="px-8 py-6 border-b border-burgundy/10">
            <div className="grid gap-6 md:grid-cols-2 text-sm text-ink">
              {/* Shipping Address */}
              <div className="border border-burgundy/5 bg-white p-5 shadow-sm rounded-sm">
                <div className="flex items-center gap-2 font-semibold text-burgundy mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>Alamat Pengiriman & Detail</span>
                </div>
                <p className="font-semibold text-xs text-muted mb-2 uppercase tracking-wider">Alamat Lengkap:</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed mb-4 text-ink/90">{order.customerAddress || "-"}</p>
                
                {order.customerNotes && (
                  <>
                    <p className="font-semibold text-xs text-muted mb-1 uppercase tracking-wider">Catatan Patokan:</p>
                    <p className="text-sm bg-cream/30 p-3 border-l-2 border-burgundy/30 text-ink/80">{order.customerNotes}</p>
                  </>
                )}
              </div>

              {/* Order Status & Shipping Tracking */}
              <div className="border border-burgundy/5 bg-white p-5 shadow-sm rounded-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-burgundy mb-4">
                    <Truck className="h-4 w-4" />
                    <span>Status & Pengiriman</span>
                  </div>
                  
                  <div className="grid gap-3 text-xs">
                    <div className="flex justify-between border-b border-offwhite pb-2">
                      <span className="text-muted">Order ID:</span>
                      <span className="font-mono font-bold text-ink">{order.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-offwhite pb-2">
                      <span className="text-muted">Jasa Kurir:</span>
                      <span className="font-bold uppercase text-ink">{order.courier || "Belum ditentukan"}</span>
                    </div>
                    <div className="flex justify-between border-b border-offwhite pb-2">
                      <span className="text-muted">Nomor Resi:</span>
                      <span className="font-bold text-ink">{order.trackingNumber || "Belum ada resi"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-offwhite text-xs text-muted flex gap-2 justify-end">
                  <span>Customer ID: {order.customerId || "Tamu"}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
