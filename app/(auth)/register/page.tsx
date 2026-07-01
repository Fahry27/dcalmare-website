"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/tracking";

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, phone, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");
      
      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      {error && <div className="p-3 bg-red-100 text-red-800 text-sm rounded-sm">{error}</div>}
      
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Username
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\\s+/g, ""))}
          placeholder="hanya huruf dan angka tanpa spasi"
          className="min-h-12 w-full border border-burgundy/15 bg-white px-4 text-base font-normal outline-none focus:border-burgundy rounded-sm"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Nama Lengkap
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sesuai nama penerima paket"
          className="min-h-12 w-full border border-burgundy/15 bg-white px-4 text-base font-normal outline-none focus:border-burgundy rounded-sm"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Nomor WhatsApp
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08..."
          className="min-h-12 w-full border border-burgundy/15 bg-white px-4 text-base font-normal outline-none focus:border-burgundy rounded-sm"
          required
        />
      </label>
      
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Password
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-12 w-full border border-burgundy/15 bg-white px-4 text-base font-normal outline-none focus:border-burgundy rounded-sm"
          required
          minLength={6}
        />
      </label>
      
      <button 
        type="submit" 
        disabled={loading}
        className="mt-2 flex min-h-12 w-full items-center justify-center bg-burgundy text-base font-semibold text-white transition hover:bg-burgundy-dark disabled:opacity-70 rounded-sm"
      >
        {loading ? "Memproses..." : "Daftar Akun"}
      </button>

      <p className="text-center text-sm text-muted mt-4">
        Sudah punya akun? <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-burgundy font-semibold hover:underline">Masuk di sini</Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="container-pad py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-md bg-offwhite border border-burgundy/10 p-6 sm:p-10 rounded-sm shadow-sm">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-burgundy">Daftar Akun</h1>
          <p className="mt-2 text-sm text-muted">Buat akun untuk melacak pesanan Anda</p>
        </div>
        <Suspense fallback={<div className="mt-8 text-center text-sm">Memuat...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
