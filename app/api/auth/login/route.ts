import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { username },
          { email: username } // Allowing them to type email in the username field
        ]
      }
    });

    if (!customer) {
      // Prevent timing attacks by hashing a dummy password
      await bcrypt.compare(password, "$2b$10$dummyhashdummyhashdummyhashdum");
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Create session token
    const token = await signToken({
      id: customer.id,
      username: customer.username,
      name: customer.name,
      phone: customer.phone
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("dcalmare_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
