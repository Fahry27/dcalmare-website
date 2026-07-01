#!/bin/bash

# Remove existing variables if any to avoid conflicts
npx vercel env rm RAJAONGKIR_API_KEY production -y 2>/dev/null || true
npx vercel env rm QRISLY_API_KEY production -y 2>/dev/null || true
npx vercel env rm KOMERCE_USER_ID production -y 2>/dev/null || true
npx vercel env rm KOMERCE_SECRET_KEY production -y 2>/dev/null || true
npx vercel env rm ADMIN_PASSWORD production -y 2>/dev/null || true
npx vercel env rm RESEND_API_KEY production -y 2>/dev/null || true

# Add new variables using echo piping
echo "M1ukGguY273b877d949e37f5100Szp4Q" | npx vercel env add RAJAONGKIR_API_KEY production
echo "SHToUhrx273b877d949e37f5jh4eIeOc" | npx vercel env add QRISLY_API_KEY production
echo "c260f887-adcb-42e1-a848-d5f9f9832637" | npx vercel env add KOMERCE_USER_ID production
echo "df072faef42ded067df233ab5b8dbbcd9977b06637d01f41b84e7c5915318027" | npx vercel env add KOMERCE_SECRET_KEY production
echo "dcalmareadmin2026" | npx vercel env add ADMIN_PASSWORD production
echo "re_FVsTc2CR_hMTN9y9xnawknSMHCWiwzXzm" | npx vercel env add RESEND_API_KEY production

echo "All Vercel environment variables have been set successfully!"
