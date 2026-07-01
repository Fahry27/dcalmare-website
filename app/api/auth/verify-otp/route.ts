import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    const record = await prisma.otpVerification.findUnique({
      where: { email }
    });

    if (!record) {
      return NextResponse.json({ error: "No pending registration found" }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "OTP expired, please register again" }, { status: 400 });
    }

    // Parse temporary data
    if (!record.tempData) {
      return NextResponse.json({ error: "Registration data lost" }, { status: 400 });
    }

    const userData = JSON.parse(record.tempData);

    // Create the customer
    const user = await prisma.customer.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone
      }
    });

    // Delete the OTP record since it's used
    await prisma.otpVerification.delete({
      where: { email }
    });

    // Automatically log them in (create session cookie)
    await signToken({
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
