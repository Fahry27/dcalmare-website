import { formatRupiah } from "../utils";

type InvoiceData = {
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: Array<{
    name: string;
    size: string;
    qty: number;
    price: number;
  }>;
  date: string;
  address: string;
};

export const InvoiceTemplate = ({
  customerName,
  orderId,
  totalAmount,
  items,
  date,
  address,
}: InvoiceData) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Pembelian dCalmare</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FBFBF9; margin: 0; padding: 20px; color: #1E1E1C; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #e5e5e5; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-family: 'Georgia', serif; font-size: 28px; color: #5B1B1B; margin: 0; }
    .greeting { font-size: 16px; margin-bottom: 20px; }
    .invoice-details { background-color: #FBFBF9; padding: 20px; border: 1px solid #e5e5e5; margin-bottom: 30px; }
    .invoice-details p { margin: 5px 0; font-size: 14px; }
    .items-table { w-full; border-collapse: collapse; margin-bottom: 30px; width: 100%; }
    .items-table th, .items-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
    .items-table th { background-color: #FBFBF9; font-weight: 600; color: #5B1B1B; }
    .total-row td { font-weight: bold; font-size: 16px; color: #5B1B1B; }
    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #80807E; border-top: 1px solid #e5e5e5; padding-top: 20px; }
    .address-box { margin-bottom: 30px; }
    .address-box p { font-size: 14px; line-height: 1.5; margin: 5px 0; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>dCalmare</h1>
      <p style="margin-top: 5px; color: #80807E; font-size: 14px;">Bukti Pembayaran (LUNAS)</p>
    </div>
    
    <div class="greeting">
      <p>Halo <strong>${customerName}</strong>,</p>
      <p>Terima kasih atas pesanan Anda. Kami telah menerima pembayaran Anda dan pesanan Anda sedang kami proses.</p>
    </div>

    <div class="invoice-details">
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Tanggal:</strong> ${date}</p>
      <p><strong>Status:</strong> <span style="color: #15803d; font-weight: bold;">PAID</span></p>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Produk</th>
          <th>Qty</th>
          <th>Harga</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>
              <span style="font-weight: 600;">${item.name}</span><br>
              <span style="font-size: 12px; color: #80807E;">Size: ${item.size}</span>
            </td>
            <td>${item.qty}</td>
            <td>${formatRupiah(item.price * item.qty)}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="2" style="text-align: right;">Total Pembayaran</td>
          <td>${formatRupiah(totalAmount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="address-box">
      <strong>Alamat Pengiriman:</strong>
      <p style="white-space: pre-wrap;">${address}</p>
    </div>

    <div class="footer">
      <p>Ini adalah email otomatis, mohon tidak membalas email ini.</p>
      <p>&copy; ${new Date().getFullYear()} dCalmare. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
