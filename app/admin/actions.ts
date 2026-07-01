"use server";

import { cookies } from "next/headers";

export async function loginAdmin(username: string, password: string) {
  const adminAccounts = [
    { user: "dewa", pass: "dewa_admin2026", token: "admin_dewa_auth_token" },
    { user: "fahry", pass: "fahry_admin2026", token: "admin_fahry_auth_token" }
  ];
  
  const account = adminAccounts.find(a => a.user === username.toLowerCase() && a.pass === password);
  
  if (account) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", account.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  
  return { success: false, error: "Username atau password salah!" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}
