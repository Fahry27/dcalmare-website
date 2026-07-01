"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm font-semibold text-burgundy border border-burgundy px-4 py-2 hover:bg-burgundy hover:text-white transition rounded-sm disabled:opacity-70"
    >
      {loading ? "Keluar..." : "Keluar Akun"}
    </button>
  );
}
