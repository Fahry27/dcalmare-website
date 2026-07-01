import { makeString } from "qris-dinamis";

export function makeDynamicQris(staticQris: string, amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("QRIS amount must be a positive number.");
  }

  return makeString(staticQris, {
    nominal: Math.round(amount).toString(),
    fee: ""
  });
}
