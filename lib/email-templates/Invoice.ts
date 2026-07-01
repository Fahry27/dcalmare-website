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
}: InvoiceData) => {
  const productSubtotal = items.reduce((total, item) => total + (item.price * item.qty), 0);
  const shippingCost = totalAmount - productSubtotal;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Pembelian dCalmare</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #FBFBF9;
      margin: 0;
      padding: 0;
      color: #1E1E1C;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #FBFBF9;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #EAEAE6;
      border-radius: 0;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    }
    .header {
      background-color: #5B1B1B;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-family: 'Georgia', serif;
      font-size: 32px;
      font-weight: normal;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: 0.08em;
    }
    .header p {
      color: #D4AF37;
      margin: 10px 0 0 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .greeting strong {
      color: #5B1B1B;
    }
    .meta-box {
      border: 1px solid #EAEAE6;
      background-color: #FBFBF9;
      padding: 20px;
      margin-bottom: 30px;
    }
    .meta-box table {
      width: 100%;
      border-collapse: collapse;
    }
    .meta-box td {
      padding: 6px 0;
      font-size: 14px;
      line-height: 1.4;
    }
    .meta-box td.label {
      color: #80807E;
      font-weight: 500;
      width: 35%;
    }
    .meta-box td.value {
      color: #1E1E1C;
      font-weight: bold;
      text-align: right;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table th {
      border-bottom: 2px solid #5B1B1B;
      padding: 12px 10px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #5B1B1B;
      font-weight: bold;
    }
    .items-table td {
      border-bottom: 1px solid #EAEAE6;
      padding: 16px 10px;
      font-size: 14px;
      line-height: 1.4;
    }
    .items-table td.qty-col, .items-table td.price-col {
      text-align: right;
    }
    .summary-box {
      border-top: 2px solid #EAEAE6;
      padding-top: 20px;
      margin-top: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      font-size: 14px;
    }
    .summary-row.total {
      font-size: 18px;
      font-weight: bold;
      color: #5B1B1B;
      border-top: 1px solid #EAEAE6;
      padding-top: 12px;
      margin-top: 8px;
    }
    .address-box {
      border-top: 1px solid #EAEAE6;
      padding-top: 30px;
      margin-top: 30px;
    }
    .address-box h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #80807E;
      margin: 0 0 10px 0;
    }
    .address-box p {
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
      color: #555552;
      white-space: pre-wrap;
    }
    .footer {
      text-align: center;
      padding: 40px 30px;
      background-color: #FBFBF9;
      border-top: 1px solid #EAEAE6;
    }
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #80807E;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>dCalmare</h1>
        <p>Bukti Pembayaran Resmi</p>
      </div>
      
      <div class="content">
        <div class="greeting">
          <p>Halo <strong>${customerName}</strong>,</p>
          <p>Terima kasih atas pesanan Anda. Kami telah memvalidasi pembayaran Anda. Saat ini pesanan Anda sedang kami siapkan untuk masuk ke tahap pengiriman.</p>
        </div>

        <div class="meta-box">
          <table>
            <tr>
              <td class="label">Nomor Invoice</td>
              <td class="value">${orderId}</td>
            </tr>
            <tr>
              <td class="label">Tanggal Bayar</td>
              <td class="value">${date}</td>
            </tr>
            <tr>
              <td class="label">Status</td>
              <td class="value"><span style="color: #16a34a; font-weight: bold; text-transform: uppercase;">Lunas (Paid)</span></td>
            </tr>
          </table>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Size</th>
              <th style="text-align: center; width: 15%;">Qty</th>
              <th style="text-align: right; width: 25%;">Harga</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="font-weight: 600; color: #1E1E1C;">${item.name}</td>
                <td style="text-align: center; color: #555552;">${item.size}</td>
                <td style="text-align: center; color: #555552;">${item.qty}</td>
                <td style="text-align: right; font-weight: 500; color: #1E1E1C;">${formatRupiah(item.price * item.qty)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary-box">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 10px; font-size: 14px; color: #555552;">Subtotal Produk</td>
              <td style="padding: 6px 10px; font-size: 14px; text-align: right; color: #1E1E1C;">${formatRupiah(productSubtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; font-size: 14px; color: #555552;">Ongkos Kirim</td>
              <td style="padding: 6px 10px; font-size: 14px; text-align: right; color: #1E1E1C;">${shippingCost > 0 ? formatRupiah(shippingCost) : 'Gratis'}</td>
            </tr>
            <tr style="border-top: 1px solid #EAEAE6; font-weight: bold;">
              <td style="padding: 14px 10px 6px 10px; font-size: 18px; color: #5B1B1B;">Total Pembayaran</td>
              <td style="padding: 14px 10px 6px 10px; font-size: 18px; text-align: right; color: #5B1B1B;">${formatRupiah(totalAmount)}</td>
            </tr>
          </table>
        </div>

        <div class="address-box">
          <h3>Alamat Pengiriman</h3>
          <p>${address}</p>
        </div>
      </div>

      <div class="footer">
        <p>Ini adalah email konfirmasi pembayaran otomatis. Mohon tidak membalas email ini secara langsung.</p>
        <p style="margin-top: 12px; font-weight: 500;">&copy; ${new Date().getFullYear()} dCalmare. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
