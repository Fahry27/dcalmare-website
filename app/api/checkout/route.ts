import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getProductBySlug } from "@/data/products";
import { generateDynamicQris } from "@shamah/dynamic-qris";
import { getSession } from "@/lib/auth";

const STATIC_QRIS = "00020101021126610014COM.GO-JEK.WWW01189360091439001046560210G9001046560303UMI51440014ID.CO.QRIS.WWW0215ID10264743996500303UMI5204581253033605802ID5918Brochacho Holdings6007TANGSEL61051522062070703A01630416A7";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, whatsapp, address, notes,
      productSlug, selectedSize, quantity
    } = body;

    const product = getProductBySlug(productSlug);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    const amount = product.price * quantity;
    const session = await getSession();

    // Create the order in database
    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerPhone: whatsapp,
        customerAddress: address,
        customerNotes: notes,
        productSlug,
        productSize: selectedSize,
        quantity,
        amount,
        customerId: session?.id || null,
        status: "PENDING",
      }
    });

    // Generate Dynamic QRIS
    const dynamicQrisResult = generateDynamicQris(STATIC_QRIS, { amount });
    const dynamicQrisString = dynamicQrisResult.payload;

    // Update order with the qris string
    await prisma.order.update({
      where: { id: order.id },
      data: { qrisString: dynamicQrisString }
    });

    return NextResponse.json({
      orderId: order.id,
      qrisString: dynamicQrisString,
      amount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
