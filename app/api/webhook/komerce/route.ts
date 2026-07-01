import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

// Valid credentials sent by user
const KOMERCE_USER_ID = "c260f887-adcb-42e1-a848-d5f9f9832637";
const KOMERCE_SECRET_KEY = "df072faef42ded067df233ab5b8dbbcd9977b06637d01f41b84e7c5915318027";

function extractAmount(message: string): number {
  const msg = message.toLowerCase();
  
  // Try to match "rp. xxx" or "sejumlah xxx"
  const rpRegex = /(?:rp|sejumlah)\.?\s*([0-9.,]+)/;
  const match = msg.match(rpRegex);
  
  if (match) {
    let numStr = match[1];
    if (numStr.endsWith(",00") || numStr.endsWith(".00")) {
      numStr = numStr.substring(0, numStr.length - 3);
    }
    const cleaned = numStr.replace(/[.,]/g, "");
    return parseInt(cleaned, 10);
  }
  
  // Fallback: look for any number sequence and strip non-digits
  const cleanMsg = msg.replace(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/g, "") // remove dates
                       .replace(/\b\d{2}:\d{2}:\d{2}\b/g, ""); // remove times

  const numberBlocks = cleanMsg.match(/[0-9.,]+/g);
  if (numberBlocks) {
    let bestBlock = "";
    for (const block of numberBlocks) {
      const cleanBlock = block.replace(/[.,]/g, "");
      if (cleanBlock.length > bestBlock.length) {
        bestBlock = block;
      }
    }
    if (bestBlock) {
      let numStr = bestBlock;
      if (numStr.endsWith(",00") || numStr.endsWith(".00")) {
        numStr = numStr.substring(0, numStr.length - 3);
      }
      return parseInt(numStr.replace(/[.,]/g, ""), 10);
    }
  }
  
  return 0;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    console.log("Komerce Webhook raw body:", rawBody);
    
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.warn("Webhook body is not valid JSON, trying to parse urlencoded");
      const params = new URLSearchParams(rawBody);
      body = Object.fromEntries(params.entries());
    }

    // Verify credentials
    const userId = body.user_id || body.userId || request.headers.get("x-user-id");
    const secret = body.secret || body.secret_key || body.secretKey || request.headers.get("x-secret-key");

    if (userId !== KOMERCE_USER_ID || secret !== KOMERCE_SECRET_KEY) {
      console.error("Unauthorized Komerce webhook access attempt", { userId, secret });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = body.message || body.text || body.body;
    if (!message) {
      console.warn("No message content found in webhook body");
      return NextResponse.json({ success: true, message: "No message processed" });
    }

    const amount = extractAmount(message);
    console.log(`Parsed payment amount: Rp ${amount} from message: "${message}"`);

    if (amount <= 0) {
      console.warn("Could not extract a valid amount from message");
      return NextResponse.json({ success: true, message: "Zero amount extracted" });
    }

    // Find the latest PENDING order matching the exact amount
    const order = await prisma.order.findFirst({
      where: {
        amount: amount,
        status: "PENDING"
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        customer: true
      }
    });

    if (!order) {
      console.warn(`No pending order found for amount Rp ${amount}`);
      return NextResponse.json({ success: true, message: `No pending order found for Rp ${amount}` });
    }

    // Update order status to PAID
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
      include: { customer: true }
    });

    console.log(`Order #${order.id} automatically marked as PAID via Komerce Webhook!`);

    // Trigger invoice email
    await sendInvoiceEmail(updatedOrder);

    return NextResponse.json({
      success: true,
      message: `Order #${order.id} successfully updated to PAID`,
      orderId: order.id,
      amount
    });
  } catch (error) {
    console.error("Error in Komerce webhook processing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
