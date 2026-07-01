"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  
  const [otp, setOtp] = useState("");

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
      
      // Success, move to step 2
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP tidak valid");
      
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
          {step === 1 ? "Buat Akun Baru" : "Verifikasi Email"}
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          {step === 1 ? "Bergabung dengan dCalmare hari ini" : `Masukkan 6 digit kode OTP yang dikirim ke ${form.email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-burgundy/10 bg-white px-4 py-8 sm:px-10">
          
          {error && (
            <div className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 ? (
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
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink text-center mb-2">Kode OTP</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full text-center text-2xl tracking-widest border border-burgundy/20 px-3 py-3 outline-none focus:border-burgundy"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex w-full justify-center bg-burgundy px-4 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-dark disabled:opacity-70"
                >
                  {loading ? "Memverifikasi..." : "Verifikasi & Buat Akun"}
                </button>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <button type="button" onClick={() => setStep(1)} className="font-semibold text-muted hover:underline">
                  Kembali Edit Data
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
