import { NextResponse } from "next/server";

// Simple free shipping calculator – no external API call.
// Returns a flat rate based on whether the destination city is in the Jakarta/Banten area.
// This mirrors the fallback logic in lib/rajaongkir.ts.
export async function POST(request: Request) {
  try {
    const { destinationCityId, courier, weightGrams } = await request.json();

    if (!destinationCityId || !courier) {
      return NextResponse.json({ error: "Destination city ID and courier are required" }, { status: 400 });
    }

    // List of city IDs considered local (Jakarta/Banten). Adjust as needed.
    const localIds = [151, 152, 153, 154, 155, 455, 456, 457, 115, 55, 79];
    const destInt = parseInt(destinationCityId, 10);
    const flatRate = localIds.includes(destInt) ? 10000 : 25000; // amounts in IDR

    return NextResponse.json({ cost: flatRate });
  } catch (error: any) {
    console.error("Shipping calculation error:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate shipping" }, { status: 500 });
  }
}
