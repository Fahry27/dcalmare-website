export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "Bahan apa yang digunakan?",
    answer:
      "Koleksi pertama kami menggunakan bahan cotton combed yang dipilih khusus karena teksturnya yang lembut dan nyaman untuk dipakai sehari-hari."
  },
  {
    question: "Bagaimana dengan ukuran (fit)-nya?",
    answer:
      "Setiap t-shirt didesain dengan potongan oversized dan boxy. Pilih ukuran normal Anda untuk tampilan santai yang pas, atau turunkan satu ukuran (size down) untuk potongan yang lebih pas di badan."
  },
  {
    question: "Bagaimana cara memesan?",
    answer:
      "Pilih produk, tentukan ukuran dan jumlah, lanjut ke checkout sebagai tamu atau member, isi detail pengiriman, bayar dengan QRIS dinamis, lalu klik tombol Saya Sudah Bayar agar admin dapat mencocokkan pembayaran."
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer:
      "Untuk saat ini, pembayaran dilakukan melalui QRIS dinamis di halaman checkout. Nominal dibuat unik agar pembayaran lebih mudah dicocokkan."
  },
  {
    question: "Bolehkah saya bayar dulu sebelum isi form?",
    answer:
      "Mohon selesaikan form checkout terlebih dahulu agar ringkasan pesanan dan nominal QRIS tercatat dengan benar. Setelah membayar, klik Saya Sudah Bayar di halaman pembayaran."
  },
  {
    question: "Apakah saya bisa menukar ukuran?",
    answer:
      "Penukaran ukuran ditangani secara manual dan sangat bergantung pada ketersediaan stok serta kondisi produk saat dikembalikan. Hubungi admin dCalmare secepatnya jika Anda ingin melakukan penukaran."
  },
  {
    question: "Berapa lama waktu pengirimannya?",
    answer:
      "Estimasi waktu pengiriman bergantung pada lokasi tujuan dan kurir yang digunakan. Admin akan menginformasikan detail resi pengiriman setelah pembayaran Anda dikonfirmasi."
  },
  {
    question: "Apakah ada pembayaran otomatis via Midtrans?",
    answer:
      "Belum ada. Pada versi awal ini, pembayaran QRIS masih diverifikasi admin berdasarkan nominal unik. Integrasi payment gateway akan ditambahkan setelah akun pembayaran aktif."
  }
];
