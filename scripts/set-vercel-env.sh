#!/bin/bash
set -euo pipefail

required_vars=(
  ADMIN_ACCOUNTS
  ADMIN_SECRET
  JWT_SECRET
  RAJAONGKIR_API_KEY
  RESEND_API_KEY
)

for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    echo "Missing required local env: ${var_name}" >&2
    exit 1
  fi

  npx vercel env rm "${var_name}" production -y 2>/dev/null || true
  printf "%s" "${!var_name}" | npx vercel env add "${var_name}" production
done

echo "All Vercel environment variables have been set successfully!"
