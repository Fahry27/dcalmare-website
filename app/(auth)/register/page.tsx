"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");
      
      // Success
      router.push("/tracking");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center font-serif text-3xl font-bold tracking-tight text-ink">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Bergabung dengan dCalmare hari ini
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-burgundy/10 bg-white px-4 py-8 sm:px-10">
          
          {error && (
            <div className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink">Nama Lengkap</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full border border-burgundy/20 px-3 py-2 outline-none focus:border-burgundy"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="block w-full border border-burgundy/20 px-3 py-2 outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Nomor WhatsApp</label>
              <div className="mt-1">
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="block w-full border border-burgundy/20 px-3 py-2 outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Username</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="block w-full border border-burgundy/20 px-3 py-2 outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full border border-burgundy/20 px-3 py-2 outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center bg-burgundy px-4 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-dark disabled:opacity-70"
              >
                {loading ? "Mendaftar..." : "Daftar"}
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted">Sudah punya akun? </span>
              <Link href="/login" className="font-semibold text-burgundy hover:underline">
                Masuk sekarang
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
