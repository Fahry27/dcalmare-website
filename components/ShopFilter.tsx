"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";

export default function ShopFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/shop?" + createQueryString("q", query));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push("/shop?" + createQueryString("category", e.target.value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push("/shop?" + createQueryString("sort", e.target.value));
  };

  return (
    <div className="mb-6 flex flex-col gap-3 border-y border-burgundy/10 py-3 md:mb-8 md:flex-row md:items-center md:justify-between md:py-4">
      <form onSubmit={handleSearch} className="relative flex-1 md:max-w-sm">
        <input
          type="text"
          aria-label="Cari koleksi"
          placeholder="Cari koleksi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-burgundy/20 bg-white py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-muted focus:border-burgundy"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-3 text-burgundy/50 hover:text-burgundy transition"
          aria-label="Cari produk"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
        <select
          aria-label="Filter kategori"
          onChange={handleCategoryChange}
          defaultValue={searchParams.get("category") || ""}
          className="border border-burgundy/20 bg-white py-2.5 px-3 text-sm outline-none focus:border-burgundy text-ink"
        >
          <option value="">Semua Kategori</option>
          <option value="Statement Tee">Statement Tee</option>
          <option value="Art Graphic Tee">Art Graphic Tee</option>
          <option value="Statement Graphic Tee">Statement Graphic Tee</option>
        </select>

        <select
          aria-label="Urutkan produk"
          onChange={handleSortChange}
          defaultValue={searchParams.get("sort") || ""}
          className="border border-burgundy/20 bg-white py-2.5 px-3 text-sm outline-none focus:border-burgundy text-ink"
        >
          <option value="">Terbaru</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="price_desc">Harga Tertinggi</option>
        </select>
      </div>
    </div>
  );
}
