import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the password for temporary storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save temporary data
    const tempData = JSON.stringify({
      username,
      email,
      password: hashedPassword,
      name,
      phone
    });

    // Save to OtpVerification (upsert if they try to register again)
    await prisma.otpVerification.upsert({
      where: { email },
      update: {
        otp,
        tempData,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      },
      create: {
        email,
        otp,
        tempData,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      }
    });

    // SIMULATED EMAIL SEND
    console.log(`\n\n==========================================`);
    console.log(`[SIMULATED EMAIL] OTP for ${email}: ${otp}`);
    console.log(`==========================================\n\n`);

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
