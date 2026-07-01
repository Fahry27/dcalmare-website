import prisma from "@/lib/prisma";
import OrderActions from "./OrderActions";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-ink">
          Admin Dashboard - Pesanan
        </h1>
        
        <div className="overflow-x-auto bg-white shadow-sm border border-burgundy/10">
          <table className="w-full text-left text-sm text-ink">
            <thead className="bg-cream text-xs uppercase text-burgundy">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted">
                    Belum ada pesanan.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-burgundy/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.createdAt.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs text-muted">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{order.productSlug}</p>
                    <p className="text-xs text-muted">Size: {order.productSize} | Qty: {order.quantity}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-burgundy">
                    {formatRupiah(order.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      order.status === "PAID" ? "bg-green-100 text-green-700" : 
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === "PENDING" && (
                      <OrderActions orderId={order.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
