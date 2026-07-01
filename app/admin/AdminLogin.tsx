"use client";

import { useState } from "react";
import { loginAdmin } from "./actions";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Gagal login");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite p-4">
      <div className="w-full max-w-sm border border-burgundy/10 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-cream p-3 text-burgundy">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Admin Login</h1>
          <p className="mt-2 text-sm text-muted">Masukkan password untuk mengakses dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="min-h-12 w-full border border-burgundy/15 bg-offwhite px-4 text-base outline-none transition focus:border-burgundy"
              required
            />
          </div>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 bg-burgundy font-semibold uppercase tracking-widest text-white transition hover:bg-burgundy-dark disabled:opacity-70"
          >
            {loading ? "Mengecek..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
