import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { makeDynamicQris } from "@/lib/qris";
import { getSession } from "@/lib/auth";
import { publicProductWhere } from "@/lib/product-visibility";
import { isAvailableProductSize } from "@/lib/size-chart";

const STATIC_QRIS = "00020101021126610014COM.GO-JEK.WWW01189360091439001046560210G9001046560303UMI51440014ID.CO.QRIS.WWW0215ID10264743996500303UMI5204581253033605802ID5918Brochacho Holdings6007TANGSEL61051522062070703A01630416A7";

async function createUniquePaymentAmount(baseAmount: number) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const uniqueCode = Math.floor(Math.random() * 899) + 101;
    const amount = baseAmount + uniqueCode;
    const existingOrder = await prisma.order.findFirst({
      where: {
        amount,
        status: { in: ["PENDING", "WAITING_CONFIRMATION"] }
      },
      select: { id: true }
    });

    if (!existingOrder) {
      return { amount, uniqueCode };
    }
  }

  const fallbackCode = Math.floor(Date.now() % 899) + 101;
  return { amount: baseAmount + fallbackCode, uniqueCode: fallbackCode };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, whatsapp, address, notes,
      items, courier, shippingCost
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const requestedItems = items.map((item: any) => ({
      productSlug: String(item.productSlug || ""),
      size: String(item.size || ""),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    }));
    const slugs = [...new Set(requestedItems.map((item: any) => item.productSlug).filter(Boolean))];
    const products = await prisma.product.findMany({
      where: {
        AND: [
          publicProductWhere,
          { slug: { in: slugs } }
        ]
      }
    });
    const productBySlug = new Map(products.map((product) => [product.slug, product]));

    const normalizedItems = requestedItems.map((item: any) => {
      const product = productBySlug.get(item.productSlug);
      if (!product || !product.sizes.includes(item.size) || !isAvailableProductSize(item.size)) {
        throw new Error("Invalid checkout item");
      }

      return {
        slug: product.slug,
        name: product.name,
        size: item.size,
        qty: item.quantity,
        price: product.price
      };
    });

    const productAmount = normalizedItems.reduce((total: number, item: any) => total + (item.price * item.qty), 0);
    const totalQuantity = normalizedItems.reduce((total: number, item: any) => total + item.qty, 0);
    const session = await getSession();

    const addedShipping = parseInt(shippingCost || "0", 10);
    const baseAmount = productAmount + addedShipping;
    const { amount: totalAmount, uniqueCode } = await createUniquePaymentAmount(baseAmount);

    // Generate Dynamic QRIS with a unique amount while gateway auto-confirmation is not active.
    const dynamicQrisString = makeDynamicQris(STATIC_QRIS, totalAmount);

    // Serialize items into productSlug
    const serializedItems = JSON.stringify(normalizedItems);

    const paymentNote = `Kode unik pembayaran: ${uniqueCode}. Total sebelum kode unik: ${baseAmount}.`;
    const mergedNotes = notes ? `${notes}\n\n${paymentNote}` : paymentNote;

    // Create the order in database
    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerPhone: whatsapp,
        customerAddress: address,
        customerNotes: mergedNotes,
        productSlug: serializedItems,
        productSize: "MULTIPLE",
        quantity: totalQuantity,
        amount: totalAmount,
        shippingCost: addedShipping,
        courier: courier || null,
        customerId: session?.id || null,
        status: "PENDING",
        qrisString: dynamicQrisString
      }
    });

    return NextResponse.json({
      orderId: order.id,
      qrisString: dynamicQrisString,
      amount: totalAmount,
      baseAmount,
      uniqueCode,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid checkout item") {
      return NextResponse.json({ error: "Invalid checkout item" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
