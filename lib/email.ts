import { Resend } from "resend";
import { InvoiceTemplate } from "./email-templates/Invoice";

const resend = new Resend(process.env.RESEND_API_KEY || "re_FVsTc2CR_hMTN9y9xnawknSMHCWiwzXzm");

export async function sendInvoiceEmail(order: any) {
  if (!order.customer?.email) {
    console.log("No customer email found for order", order.id);
    return;
  }

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
