import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send real email via Resend
    const { data, error } = await resend.emails.send({
      from: "dCalmare <onboarding@resend.dev>", // Using Resend's default testing domain
      to: [email],
      subject: "Kode OTP Pendaftaran dCalmare Anda",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #4A0E17; text-align: center;">dCalmare</h2>
          <p>Halo <strong>${name}</strong>,</p>
          <p>Terima kasih telah mendaftar. Berikut adalah kode OTP Anda untuk memverifikasi email ini:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Kode ini hanya berlaku selama <strong>5 menit</strong>.</p>
          <p>Jika Anda tidak merasa mendaftar di dCalmare, abaikan email ini.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: "Failed to send email OTP" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

