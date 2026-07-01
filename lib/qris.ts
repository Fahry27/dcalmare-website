function crc16(data: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;
  
  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i);
    crc ^= (code << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function parseQris(qris: string): Record<string, string> {
  const result: Record<string, string> = {};
  let i = 0;
  while (i < qris.length) {
    const tag = qris.substring(i, i + 2);
    const lengthVal = qris.substring(i + 2, i + 4);
    const length = parseInt(lengthVal, 10);
    const value = qris.substring(i + 4, i + 4 + length);
    result[tag] = value;
    i += 4 + length;
  }
  return result;
}

export function makeDynamicQris(staticQris: string, amount: number): string {
  try {
    const tags = parseQris(staticQris);
    tags["01"] = "12"; // Dynamic QR Code
    tags["54"] = amount.toString(); // Transaction Amount
    delete tags["63"]; // Remove CRC so we can recalculate
    
    let serialized = "";
    const keys = Object.keys(tags).sort();
    for (const key of keys) {
      const val = tags[key];
      const len = val.length.toString().padStart(2, "0");
      serialized += `${key}${len}${val}`;
    }
    
    serialized += "6304";
    const checksum = crc16(serialized);
    return serialized + checksum;
  } catch (error) {
    console.error("Failed to generate dynamic QRIS", error);
    return staticQris; // Fallback to static if anything fails
  }
}
