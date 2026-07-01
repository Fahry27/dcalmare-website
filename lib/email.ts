import { Resend } from "resend";
import { InvoiceTemplate } from "./email-templates/Invoice";

export async function sendInvoiceEmail(order: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured; invoice email skipped.");
    return;
  }

  if (!order.customer?.email) {
    console.log("No customer email found for order", order.id);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Parse serialized items
  let items = [];
  try {
    items = JSON.parse(order.productSlug);
  } catch (e) {
    items = [{
      name: order.productSlug.replace(/-/g, " "),
      size: order.productSize,
      qty: order.quantity,
      price: (order.amount - order.shippingCost) / order.quantity
    }];
  }

  try {
    const data = await resend.emails.send({
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
    console.log("Invoice email sent successfully:", data);
  } catch (error) {
    console.error("Failed to send invoice email:", error);
  }
}
