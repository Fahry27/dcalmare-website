import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatRupiah, cn } from "@/lib/utils";
import OrderTimeline from "@/components/OrderTimeline";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="bg-offwhite py-12 md:py-24 min-h-[70vh]">
      <div className="container-pad">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
              Portal Member
            </p>
            <h1 className="mt-4 break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Halo, {session.name}
            </h1>
            <p className="mt-2 text-muted">
              Kelola pesanan dan pantau pre-order Anda dari sini.
            </p>
          </div>
          
          <form action="/api/auth/logout" method="POST" className="block">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center border border-burgundy/20 bg-white px-6 text-sm font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:border-burgundy hover:bg-burgundy hover:text-white"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_2.5fr]">
          <div className="min-w-0 border border-burgundy/10 bg-white p-6 self-start">
            <h2 className="font-serif text-xl font-semibold text-ink mb-6">Detail Profil</h2>
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Nama Lengkap</dt>
                <dd className="font-semibold text-ink">{session.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Username / Email</dt>
                <dd className="font-semibold text-ink">{session.username}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Nomor WhatsApp</dt>
                <dd className="font-semibold text-ink">{session.phone}</dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Riwayat Pemesanan</h2>
            
            {orders.length === 0 ? (
              <div className="border border-burgundy/10 bg-white p-12 text-center">
                <p className="text-muted mb-6">Anda belum pernah melakukan pemesanan pre-order.</p>
                <Link
                  href="/shop"
                  className="inline-flex min-h-12 items-center justify-center bg-burgundy px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-burgundy-dark"
                >
                  Belanja Sekarang
                </Link>
              </div>
            ) : (
              <div className="grid gap-5">
                {orders.map((order) => {
                  let items = [];
                  try {
                    items = JSON.parse(order.productSlug);
                  } catch (e) {
                    items = [];
                  }

                  return (
                    <div key={order.id} className="border border-burgundy/10 bg-white overflow-hidden transition hover:border-burgundy/30">
                      <div className="bg-cream border-b border-burgundy/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-burgundy mb-1">
                            Order ID
                          </p>
                          <p className="font-mono text-sm text-ink">{order.id}</p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">
                            Tanggal Pemesanan
                          </p>
                          <p className="text-sm font-medium text-ink">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-ink mb-4 border-b border-burgundy/10 pb-2">Item yang Dipesan</h3>
                            <div className="grid gap-3">
                              {items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <div>
                                    <p className="font-medium text-ink">{item.name}</p>
                                    <p className="text-xs text-muted">Size: {item.size} <span className="mx-1">•</span> Qty: {item.qty}</p>
                                  </div>
                                  <p className="font-semibold text-burgundy">{formatRupiah(item.price * item.qty)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="w-full md:w-48 shrink-0 bg-offwhite p-4 rounded-sm border border-burgundy/5 flex flex-col justify-center">
                            <p className="text-xs text-muted uppercase tracking-wider mb-1 text-center">Total Pembayaran</p>
                            <p className="text-lg font-bold text-burgundy text-center mb-4">{formatRupiah(order.amount)}</p>
                            
                            <div className={cn(
                              "text-center py-2 text-xs font-bold uppercase tracking-wider w-full",
                              order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                              order.status === "WAITING_CONFIRMATION" ? "bg-orange-100 text-orange-800" :
                              order.status === "PAID" ? "bg-green-100 text-green-800" :
                              order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                              order.status === "COMPLETED" ? "bg-teal-100 text-teal-800" :
                              "bg-red-100 text-red-800"
                            )}>
                              {order.status === "WAITING_CONFIRMATION" ? "CEK MUTASI" : order.status}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-burgundy/10">
                          <h4 className="font-serif text-sm font-semibold text-ink mb-4">Status & Pelacakan Pengiriman</h4>
                          <OrderTimeline order={order} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
