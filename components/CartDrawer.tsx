"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatRupiah } from "@/lib/utils";
import { getActiveProductPrice } from "@/lib/pricing";
import SafeImage from "./SafeImage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const router = useRouter();
  
  // Prevent hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-burgundy/10 p-6">
              <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
                <ShoppingBag className="h-6 w-6 text-burgundy" />
                Keranjang
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted transition hover:bg-offwhite hover:text-ink"
                aria-label="Tutup keranjang"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-offwhite p-6">
                    <ShoppingBag className="h-12 w-12 text-muted/30" />
                  </div>
                  <p className="mt-4 font-serif text-lg font-semibold text-ink">
                    Keranjang Anda Kosong
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Sepertinya Anda belum memilih apa pun.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/shop");
                    }}
                    className="mt-6 border border-burgundy px-6 py-2 text-sm font-semibold uppercase tracking-widest text-burgundy transition hover:bg-burgundy hover:text-white"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {items.map((item) => {
                    const activePrice = getActiveProductPrice(item.product);

                    return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative aspect-[3/4] w-20 shrink-0 bg-offwhite sm:w-24">
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                          fallbackLabel={item.product.name}
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-ink">{item.product.name}</h3>
                          <p className="text-sm text-muted">Size: {item.size}</p>
                          <p className="mt-1 font-semibold text-burgundy">
                            {formatRupiah(activePrice)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-burgundy/20 px-3 py-1">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              className="text-muted transition hover:text-burgundy"
                              aria-label={`Kurangi jumlah ${item.product.name}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-muted transition hover:text-burgundy"
                              aria-label={`Tambah jumlah ${item.product.name}`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted transition hover:text-red-600"
                            aria-label={`Hapus ${item.product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-burgundy/10 bg-offwhite p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between font-serif text-xl font-bold text-ink">
                  <span>Subtotal</span>
                  <span>{formatRupiah(getTotalPrice())}</span>
                </div>
                <div className="mb-5 grid gap-2 border border-burgundy/10 bg-white p-3 text-xs leading-relaxed text-muted">
                  <p>Ongkos kirim dihitung di checkout.</p>
                  <p>Bayar pakai QRIS dinamis, lalu klik konfirmasi pembayaran.</p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/checkout");
                  }}
                  className="w-full bg-burgundy py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-burgundy-dark"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
