import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { makeDynamicQris } from "@/lib/qris";
import { getSession } from "@/lib/auth";

const STATIC_QRIS = "00020101021126610014COM.GO-JEK.WWW01189360091439001046560210G9001046560303UMI51440014ID.CO.QRIS.WWW0215ID10264743996500303UMI5204581253033605802ID5918Brochacho Holdings6007TANGSEL61051522062070703A01630416A7";

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

    const productAmount = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((total: number, item: any) => total + item.quantity, 0);
    const session = await getSession();

    const addedShipping = parseInt(shippingCost || "0", 10);
    const totalAmount = productAmount + addedShipping;

    // Generate Dynamic QRIS with exact total amount
    const dynamicQrisString = makeDynamicQris(STATIC_QRIS, totalAmount);

    // Serialize items into productSlug
    const serializedItems = JSON.stringify(items.map((i: any) => ({
      slug: i.productSlug,
      name: i.productName,
      size: i.size,
      qty: i.quantity,
      price: i.price
    })));

    // Create the order in database
    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerPhone: whatsapp,
        customerAddress: address,
        customerNotes: notes,
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
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
