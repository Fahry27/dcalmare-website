declare module "qris-dinamis" {
  type MakeStringOptions = {
    nominal: string;
    taxtype?: "p" | "r";
    fee?: string;
  };

  type MakeFileOptions = MakeStringOptions & {
    base64?: boolean;
    path?: string;
  };

  export function makeString(qris: string, options: MakeStringOptions): string;
  export function makeFile(qris: string, options: MakeFileOptions): string | Promise<string>;
}
