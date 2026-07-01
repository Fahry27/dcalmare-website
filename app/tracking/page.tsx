import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

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
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-burgundy/15 bg-white p-5 sm:p-6 rounded-sm shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 pb-4 border-b border-burgundy/10">
                <div>
                  <p className="text-xs font-semibold text-muted mb-1">Order ID</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted mb-1">Tanggal</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted mb-1">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-sm ${
                    order.status === "PAID" ? "bg-green-100 text-green-700" :
                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-ink text-lg">{order.productSlug.replace(/-/g, " ")}</p>
                  <p className="text-sm text-muted">Ukuran: {order.productSize} | Qty: {order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-burgundy text-lg">{formatRupiah(order.amount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
