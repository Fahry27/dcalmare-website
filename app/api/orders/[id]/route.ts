import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { InvoiceTemplate } from "@/lib/email-templates/Invoice";

const resend = new Resend(process.env.RESEND_API_KEY);

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

// Admin can update status via PUT or PATCH
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true // Include customer to get email
      }
    });

    // Send invoice email if status becomes PAID
    if (status === "PAID" && order.customer?.email) {
      // Parse serialized items
      let items = [];
      try {
        items = JSON.parse(order.productSlug);
      } catch (e) {
        // Fallback if not using cart array format
        items = [{
          name: order.productSlug,
          size: order.productSize,
          qty: order.quantity,
          price: order.amount / order.quantity
        }];
      }

      await resend.emails.send({
        from: 'dCalmare <onboarding@resend.dev>',
        to: order.customer.email,
        subject: `dCalmare Invoice - Pesanan Lunas #${order.id}`,
        html: InvoiceTemplate({
          customerName: order.customerName,
          orderId: order.id,
          totalAmount: order.amount,
          date: order.createdAt.toLocaleString('id-ID'),
          address: order.customerAddress || '-',
          items: items
        })
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
