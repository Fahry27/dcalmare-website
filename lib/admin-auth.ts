import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

type AdminAccount = {
  user: string;
  pass: string;
};

const ADMIN_COOKIE_NAME = "admin_token";

function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET or JWT_SECRET must be configured.");
  }
  return new TextEncoder().encode(secret);
}

function getAdminAccounts(): AdminAccount[] {
  const rawAccounts = process.env.ADMIN_ACCOUNTS;
  if (!rawAccounts) {
    if (process.env.NODE_ENV !== "production") {
      return [
        { user: "dewa", pass: "dewa_admin2026" },
        { user: "fahry", pass: "fahry_admin2026" }
      ];
    }
    return [];
  }

  return rawAccounts
    .split(",")
    .map((entry) => {
      const [user, pass] = entry.split(":");
      return { user: user?.trim().toLowerCase(), pass: pass?.trim() };
    })
    .filter((account): account is AdminAccount => Boolean(account.user && account.pass));
}

export async function signAdminToken(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAdminSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAdminSecret());
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  return Boolean(session);
}

export async function setAdminCookie(username: string) {
  const token = await signAdminToken(username);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function validateAdminCredentials(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();
  return getAdminAccounts().some(
    (account) => account.user === normalizedUsername && account.pass === password
  );
}
