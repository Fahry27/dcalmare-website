import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/admin-auth";
import { getSession } from "@/lib/auth";

const ADMIN_ORDER_STATUSES = new Set([
  "PENDING",
  "WAITING_CONFIRMATION",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "FAILED",
  "REFUNDED"
]);

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (body.action === "complete-order") {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        select: { status: true, customerId: true }
      });

      if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (order.customerId !== session.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (order.status !== "SHIPPED") {
        return NextResponse.json({ status: order.status });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: "COMPLETED" },
        select: { status: true }
      });

      return NextResponse.json({ success: true, status: updatedOrder.status });
    }

    if (body.action !== "confirm-payment") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (order.status !== "PENDING" && order.status !== "WAITING_CONFIRMATION") {
      return NextResponse.json({ status: order.status });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "WAITING_CONFIRMATION" },
      select: { status: true }
    });

    return NextResponse.json({ success: true, status: updatedOrder.status });
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
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, courier, trackingNumber } = await request.json();

    if (!ADMIN_ORDER_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

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
