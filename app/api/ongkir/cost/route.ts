import { NextResponse } from "next/server";
import { getShippingCost } from "@/lib/rajaongkir";

export async function POST(request: Request) {
  try {
    const { destinationCityId, courier, weightGrams } = await request.json();
    
    if (!destinationCityId || !courier) {
      return NextResponse.json({ error: "Destination city ID and courier are required" }, { status: 400 });
    }

    const cost = await getShippingCost(destinationCityId, courier, weightGrams || 1000);
    return NextResponse.json({ cost });
  } catch (error: any) {
    console.error("Shipping API error:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate shipping" }, { status: 500 });
  }
}
