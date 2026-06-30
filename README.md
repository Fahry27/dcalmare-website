# dCalmare MVP Website

Premium local fashion/lifestyle MVP website for dCalmare. The site provides a catalog, product detail pages, a simple checkout flow, manual GoPay Merchant QR payment, and final WhatsApp confirmation after payment.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local mock data
- Static public assets

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm run start
```

## Deployment Notes

This project is intended to deploy on Vercel using the default Next.js settings. After the GitHub repository is connected to Vercel, every push to the `main` branch should trigger an automatic production deployment or deployment according to the Vercel project settings.

## Required Public Assets

The website expects these files in `public/`:

- `public/brand/dcalmare-logo.jpg`
- `public/products/500-million-tee.jpg`
- `public/products/bottle-collection-tee.jpg`
- `public/products/matcha-champagne-tee.jpg`
- `public/payment/gopay-merchant-qr.jpg`

The current implementation also supports additional editorial assets in `public/brand/` and `public/products/`.

## Manual GoPay Merchant QR Payment

Checkout is intentionally manual for this MVP. Customers choose a product, select size and quantity, complete the checkout form, scan the GoPay Merchant QR code, finish payment manually, then click the WhatsApp confirmation button to send the completed order summary to the dCalmare admin.

WhatsApp is only used after checkout and payment confirmation. It is not the initial order channel.

## Future Phase

Midtrans or another automated payment provider can be added in a future phase. This MVP does not include Midtrans, a backend, database, cart, login, or admin dashboard.
