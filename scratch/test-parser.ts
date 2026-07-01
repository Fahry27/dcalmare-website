function extractAmount(message: string): number {
  const msg = message.toLowerCase();
  
  // Try to match "rp. xxx" or "sejumlah xxx"
  const rpRegex = /(?:rp|sejumlah)\.?\s*([0-9.,]+)/;
  const match = msg.match(rpRegex);
  
  if (match) {
    let numStr = match[1];
    // If it ends with decimals like ,00 or .00, remove it
    if (numStr.endsWith(",00") || numStr.endsWith(".00")) {
      numStr = numStr.substring(0, numStr.length - 3);
    }
    // Remove all separators
    const cleaned = numStr.replace(/[.,]/g, "");
    return parseInt(cleaned, 10);
  }
  
  // Fallback: look for any number sequence and strip non-digits
  // Except we must be careful with dates like 01/07/26
  // Remove date patterns first
  const cleanMsg = msg.replace(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/g, "") // remove dates DD/MM/YY
                       .replace(/\b\d{2}:\d{2}:\d{2}\b/g, ""); // remove times HH:MM:SS

  // Match the largest number block that doesn't look like a date or time
  const numberBlocks = cleanMsg.match(/[0-9.,]+/g);
  if (numberBlocks) {
    // Find the longest number block which is likely the amount
    let bestBlock = "";
    for (const block of numberBlocks) {
      const cleanBlock = block.replace(/[.,]/g, "");
      if (cleanBlock.length > bestBlock.length) {
        bestBlock = block;
      }
    }
    if (bestBlock) {
      let numStr = bestBlock;
      if (numStr.endsWith(",00") || numStr.endsWith(".00")) {
        numStr = numStr.substring(0, numStr.length - 3);
      }
      return parseInt(numStr.replace(/[.,]/g, ""), 10);
    }
  }
  
  return 0;
}

const tests = [
  "M-Transfer: BERHASIL Transfer dari Budi Rp. 150.000,00 ke Rekening 1234",
  "Transfer dari FAHRY Sejumlah 1.000,00 Berhasil",
  "Dana masuk Rp 1",
  "TRANSFER MASUK DR DANA RP 25.500",
  "WS::01/07/26 19:50:01 Dana Masuk QRIS Sejumlah 100.000 Berhasil"
];

for (const t of tests) {
  console.log(`Msg: "${t}" -> Extracted:`, extractAmount(t));
}
