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
      "Pilih produk, tentukan ukuran dan jumlah, klik lanjut ke pembayaran, isi detail pengiriman Anda, bayar menggunakan QR GoPay Merchant, lalu konfirmasi melalui WhatsApp."
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer:
      "Untuk saat ini, pembayaran dilakukan secara manual melalui QR GoPay Merchant yang tertera di halaman checkout."
  },
  {
    question: "Bolehkah saya bayar dulu sebelum isi form?",
    answer:
      "Mohon selesaikan pengisian form checkout di website terlebih dahulu agar ringkasan pesanan Anda tercatat. Setelah itu, silakan scan QR GoPay Merchant dan konfirmasi pesanan melalui WhatsApp."
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
      "Belum ada. Pada versi awal ini, semua pembayaran dilakukan secara manual menggunakan QR GoPay Merchant dan konfirmasi melalui WhatsApp."
  }
];
