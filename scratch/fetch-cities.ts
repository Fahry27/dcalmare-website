import axios from "axios";
import fs from "fs";
import path from "path";

const API_KEY = "M1ukGguY273b877d949e37f5100Szp4Q";

async function main() {
  try {
    const response = await axios.get("https://api.rajaongkir.com/starter/city", {
      headers: { key: API_KEY }
    });
    
    const cities = response.data.rajaongkir.results;
    console.log("Total cities fetched:", cities.length);
    
    // Find Tangerang Selatan
    const tangsel = cities.find((c: any) => c.city_name.toLowerCase().includes("tangerang selatan") || c.city_name.toLowerCase() === "tangerang");
    console.log("Tangerang Selatan / Tangerang search results:", tangsel);
    
    // Save cities to JSON file
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(path.join(dataDir, "cities.json"), JSON.stringify(cities, null, 2));
    console.log("Saved cities to data/cities.json");
  } catch (error: any) {
    console.error("Error fetching cities:", error.response ? error.response.data : error.message);
  }
}

main();
