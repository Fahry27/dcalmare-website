"use server";

import { cookies } from "next/headers";

export async function loginAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || "dcalmare123";
  
  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  
  return { success: false, error: "Password salah!" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}
