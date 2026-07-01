# dCalmare MVP Website

Premium local fashion/lifestyle website for dCalmare. The site provides a product catalog, product detail pages, cart, guest/member checkout, dynamic QRIS payment, order tracking, customer profile, wishlist, and an admin order dashboard.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma database
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

Required production environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_SECRET`
- `ADMIN_ACCOUNTS` as comma-separated `username:password` pairs
- `RAJAONGKIR_API_KEY`
- `RESEND_API_KEY`

## Required Manual Steps Before Launch

Before launching the site to real customers, the store owner **must** complete these steps:
1. **Set Admin Credentials:** Configure `ADMIN_ACCOUNTS` and `ADMIN_SECRET` in Vercel before production login.
2. **Verify Static QRIS:** Ensure `STATIC_QRIS_PAYLOAD` or the QRIS payload used by `lib/qris.ts` is the merchant's real static QRIS source.
3. **Verify Product Data:** Ensure Prisma product records contain accurate stock, price, descriptions, and images.
4. **Verify Brand Assets:** Replace `public/brand/*` and `public/products/*` with the high-resolution brand photography.
5. **Verify Contact Channels:** Update footer/contact values to the store's real WhatsApp, Instagram, and email.

## Required Public Assets

The website expects these files in `public/`:

- `public/brand/dcalmare-logo.jpg`
- `public/products/500-million-tee.jpg`
- `public/products/bottle-collection-tee.jpg`
- `public/products/matcha-champagne-tee.jpg`
- `public/favicon.png`

The current implementation also supports additional editorial assets in `public/brand/` and `public/products/`.

## Dynamic QRIS Payment

Checkout is intentionally manual until Midtrans or another automated payment provider is ready. Customers choose products, complete checkout as a guest or member, scan a dynamic QRIS generated for the exact order total, then click "Saya Sudah Bayar" so the order enters admin verification.

Payment receipt verification is handled from the admin dashboard.

## Future Phase

Midtrans or another automated payment provider can be added in a future phase for automatic payment status callbacks.
