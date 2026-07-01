export const sizeChart = [
  { size: "M", width: "92 cm", length: "56 cm" },
  { size: "L", width: "98 cm", length: "57 cm" },
  { size: "XL", width: "102 cm", length: "59 cm" }
] as const;

export const availableProductSizes = sizeChart.map((row) => row.size);

export function isAvailableProductSize(size: string) {
  return availableProductSizes.includes(size as (typeof availableProductSizes)[number]);
}
