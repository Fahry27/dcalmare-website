import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password, name, phone } = await request.json();

    if (!username || !password || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { username }
    });

    if (existingCustomer) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        username,
        password: hashedPassword,
        name,
        phone
      }
    });

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
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
