import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import OrderTimeline from "@/components/OrderTimeline";

export default async function TrackingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirect=/tracking");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container-pad py-16 md:py-24 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Halo, {session.name}</h1>
          <p className="text-muted mt-2">Berikut adalah riwayat pesanan dan status pengiriman Anda.</p>
        </div>
        <LogoutButton />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 border border-burgundy/10 bg-white">
          <p className="text-muted mb-4">Anda belum memiliki pesanan.</p>
          <Link href="/shop" className="text-burgundy font-semibold hover:underline">Mulai belanja sekarang</Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map((order) => {
            let items = [];
            try {
              items = JSON.parse(order.productSlug);
            } catch (e) {
              items = [{
                name: order.productSlug.replace(/-/g, " "),
                size: order.productSize,
                qty: order.quantity,
                price: order.amount / order.quantity
              }];
            }

            return (
              <div key={order.id} className="border border-burgundy/15 bg-white shadow-sm overflow-hidden">
                <div className="bg-cream px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-burgundy/10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-burgundy mb-1">Order ID: {order.id}</p>
                    <p className="text-sm font-semibold text-ink">{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-widest text-burgundy mb-1">Total Belanja</p>
                    <p className="text-lg font-bold text-ink">{formatRupiah(order.amount)}</p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Timeline */}
                  <div className="mb-8 border-b border-burgundy/10 pb-8">
                    <OrderTimeline order={order} />
                  </div>

                  {/* Order Items */}
                  <div className="grid gap-4">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-4 border-t border-offwhite first:border-0 first:pt-0">
                        <div>
                          <p className="font-semibold text-ink">{item.name}</p>
                          <p className="text-sm text-muted mt-1">Ukuran: {item.size} | Qty: {item.qty || item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-burgundy">{formatRupiah((item.price * (item.qty || item.quantity)) || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {(order.status === "PENDING" || order.status === "WAITING_CONFIRMATION") && (
                    <div className="mt-6 pt-6 border-t border-burgundy/10 text-center">
                      <p className="text-sm text-muted mb-3">
                        {order.status === "WAITING_CONFIRMATION"
                          ? "Pembayaran sedang dicocokkan dengan mutasi masuk."
                          : "Pesanan Anda sedang menunggu pembayaran."}
                      </p>
                      {order.status === "PENDING" ? (
                        <Link href={`/checkout?product=continue`} className="inline-block bg-burgundy text-white px-6 py-2 text-sm font-semibold uppercase tracking-widest hover:bg-burgundy-dark transition">
                          Selesaikan Pembayaran
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
