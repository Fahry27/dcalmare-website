import prisma from "@/lib/prisma";
import OrderRow from "./OrderRow";
import AdminLogin from "./AdminLogin";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return <AdminLogin />;
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8 border-b border-burgundy/10 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink">
              dCalmare Admin
            </h1>
            <p className="text-xs text-muted mt-1 uppercase tracking-widest font-semibold">Dashboard Manajemen Pesanan</p>
          </div>
          
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="border border-burgundy/20 hover:border-burgundy bg-white text-burgundy hover:bg-burgundy hover:text-white transition px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Logout Admin
            </button>
          </form>
        </div>
        
        <div className="overflow-x-auto bg-white shadow-sm border border-burgundy/10">
          <table className="w-full text-left text-sm text-ink border-collapse">
            <thead className="bg-cream text-xs uppercase text-burgundy tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Ongkir & Kurir</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted font-medium">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
