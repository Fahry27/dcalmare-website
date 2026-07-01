const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || "M1ukGguY273b877d949e37f5100Szp4Q";
const ORIGIN_CITY_ID = "457"; // Tangerang Selatan (Tangsel)

type RajaOngkirCostResponse = {
  rajaongkir: {
    results: Array<{
      code: string;
      name: string;
      costs: Array<{
        service: string;
        description: string;
        cost: Array<{
          value: number;
          etd: string;
          note: string;
        }>;
      }>;
    }>;
  };
};

export async function getShippingCost(
  destinationCityId: string,
  courier: string,
  weightGrams: number = 1000
): Promise<number> {
  try {
    const params = new URLSearchParams();
    params.append("origin", ORIGIN_CITY_ID);
    params.append("destination", destinationCityId);
    params.append("weight", weightGrams.toString());
    params.append("courier", courier.toLowerCase());

    const res = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "key": RAJAONGKIR_API_KEY,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("RajaOngkir error response:", errText);
      throw new Error(`RajaOngkir request failed: ${res.status}`);
    }

    const data = (await res.json()) as RajaOngkirCostResponse;
    const courierResults = data.rajaongkir.results[0];
    
    if (!courierResults || courierResults.costs.length === 0) {
      throw new Error("No shipping services available for this courier");
    }

    // Default to the first available service cost (usually REG / cheapest regular)
    const costValue = courierResults.costs[0].cost[0].value;
    return costValue;
  } catch (error) {
    console.error("Failed to calculate shipping via RajaOngkir, using fallback flat rate", error);
    // Fallback: DKI Jakarta / Banten flat rate, other regions different flat rate
    const destinationInt = parseInt(destinationCityId, 10);
    const isLocalBantenDki = [151, 152, 153, 154, 155, 455, 456, 457, 115, 55, 79].includes(destinationInt);
    return isLocalBantenDki ? 10000 : 25000;
  }
}
