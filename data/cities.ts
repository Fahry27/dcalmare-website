export type City = {
  city_id: string;
  city_name: string;
  type: string;
  postal_code: string;
  province: string;
  province_id: string;
};

export const POPULAR_CITIES: City[] = [
  // DKI Jakarta
  { city_id: "151", city_name: "Jakarta Barat", type: "Kota", postal_code: "11210", province: "DKI Jakarta", province_id: "6" },
  { city_id: "152", city_name: "Jakarta Pusat", type: "Kota", postal_code: "10110", province: "DKI Jakarta", province_id: "6" },
  { city_id: "153", city_name: "Jakarta Selatan", type: "Kota", postal_code: "12110", province: "DKI Jakarta", province_id: "6" },
  { city_id: "154", city_name: "Jakarta Timur", type: "Kota", postal_code: "13110", province: "DKI Jakarta", province_id: "6" },
  { city_id: "155", city_name: "Jakarta Utara", type: "Kota", postal_code: "14110", province: "DKI Jakarta", province_id: "6" },
  
  // Banten
  { city_id: "457", city_name: "Tangerang Selatan", type: "Kota", postal_code: "15412", province: "Banten", province_id: "3" },
  { city_id: "455", city_name: "Tangerang", type: "Kota", postal_code: "15111", province: "Banten", province_id: "3" },
  { city_id: "456", city_name: "Tangerang", type: "Kabupaten", postal_code: "15710", province: "Banten", province_id: "3" },
  { city_id: "402", city_name: "Serang", type: "Kota", postal_code: "42111", province: "Banten", province_id: "3" },
  { city_id: "102", city_name: "Cilegon", type: "Kota", postal_code: "42414", province: "Banten", province_id: "3" },

  // Jawa Barat
  { city_id: "23", city_name: "Bandung", type: "Kota", postal_code: "40111", province: "Jawa Barat", province_id: "9" },
  { city_id: "22", city_name: "Bandung", type: "Kabupaten", postal_code: "40311", province: "Jawa Barat", province_id: "9" },
  { city_id: "55", city_name: "Bekasi", type: "Kota", postal_code: "17121", province: "Jawa Barat", province_id: "9" },
  { city_id: "54", city_name: "Bekasi", type: "Kabupaten", postal_code: "17510", province: "Jawa Barat", province_id: "9" },
  { city_id: "79", city_name: "Bogor", type: "Kota", postal_code: "16119", province: "Jawa Barat", province_id: "9" },
  { city_id: "78", city_name: "Bogor", type: "Kabupaten", postal_code: "16911", province: "Jawa Barat", province_id: "9" },
  { city_id: "115", city_name: "Depok", type: "Kota", postal_code: "16411", province: "Jawa Barat", province_id: "9" },
  { city_id: "107", city_name: "Cimahi", type: "Kota", postal_code: "40511", province: "Jawa Barat", province_id: "9" },
  { city_id: "109", city_name: "Cirebon", type: "Kota", postal_code: "45111", province: "Jawa Barat", province_id: "9" },
  { city_id: "181", city_name: "Karawang", type: "Kabupaten", postal_code: "41311", province: "Jawa Barat", province_id: "9" },
  { city_id: "469", city_name: "Tasikmalaya", type: "Kota", postal_code: "46111", province: "Jawa Barat", province_id: "9" },

  // Jawa Tengah & DIY
  { city_id: "399", city_name: "Semarang", type: "Kota", postal_code: "50135", province: "Jawa Tengah", province_id: "10" },
  { city_id: "445", city_name: "Surakarta (Solo)", type: "Kota", postal_code: "57111", province: "Jawa Tengah", province_id: "10" },
  { city_id: "501", city_name: "Yogyakarta", type: "Kota", postal_code: "55111", province: "DI Yogyakarta", province_id: "5" },
  { city_id: "419", city_name: "Sleman", type: "Kabupaten", postal_code: "55511", province: "DI Yogyakarta", province_id: "5" },
  { city_id: "39", city_name: "Bantul", type: "Kabupaten", postal_code: "55711", province: "DI Yogyakarta", province_id: "5" },

  // Jawa Timur
  { city_id: "444", city_name: "Surabaya", type: "Kota", postal_code: "60111", province: "Jawa Timur", province_id: "11" },
  { city_id: "256", city_name: "Malang", type: "Kota", postal_code: "65111", province: "Jawa Timur", province_id: "11" },
  { city_id: "255", city_name: "Malang", type: "Kabupaten", postal_code: "65163", province: "Jawa Timur", province_id: "11" },
  { city_id: "409", city_name: "Sidoarjo", type: "Kabupaten", postal_code: "61211", province: "Jawa Timur", province_id: "11" },
  { city_id: "133", city_name: "Gresik", type: "Kabupaten", postal_code: "61111", province: "Jawa Timur", province_id: "11" },

  // Bali
  { city_id: "114", city_name: "Denpasar", type: "Kota", postal_code: "80221", province: "Bali", province_id: "1" },

  // Luar Jawa
  { city_id: "278", city_name: "Medan", type: "Kota", postal_code: "20111", province: "Sumatera Utara", province_id: "34" },
  { city_id: "327", city_name: "Palembang", type: "Kota", postal_code: "30111", province: "Sumatera Selatan", province_id: "33" },
  { city_id: "333", city_name: "Pekanbaru", type: "Kota", postal_code: "28111", province: "Riau", province_id: "26" },
  { city_id: "254", city_name: "Makassar", type: "Kota", postal_code: "90111", province: "Sulawesi Selatan", province_id: "28" },
  { city_id: "34", city_name: "Balikpapan", type: "Kota", postal_code: "76111", province: "Kalimantan Timur", province_id: "15" },
  { city_id: "388", city_name: "Samarinda", type: "Kota", postal_code: "75111", province: "Kalimantan Timur", province_id: "15" }
].sort((a, b) => a.city_name.localeCompare(b.city_name));
