import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, email, password, name, phone } = await request.json();

    if (!username || !email || !password || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if username or email already exists
    const existingUser = await prisma.customer.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username or Email already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        username,
        email,
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
