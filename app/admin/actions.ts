"use server";

import { clearAdminCookie, setAdminCookie, validateAdminCredentials } from "@/lib/admin-auth";

export async function loginAdmin(username: string, password: string) {
  if (validateAdminCredentials(username, password)) {
    await setAdminCookie(username.trim().toLowerCase());
    return { success: true };
  }
  
  return { success: false, error: "Username atau password salah!" };
}

export async function logoutAdmin() {
  await clearAdminCookie();
}
