import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ status: order.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// Admin can update status and tracking details via PATCH
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, courier, trackingNumber } = await request.json();

    const updateData: any = { status };
    if (courier !== undefined) updateData.courier = courier;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true // Include customer to get email
      }
    });

    // Send invoice email if status becomes PAID
    if (status === "PAID") {
      await sendInvoiceEmail(order);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
