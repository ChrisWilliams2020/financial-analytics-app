#!/bin/bash

echo "🔍 MedPact Analytics - Auth Setup Checker"
echo "=========================================="
echo ""

cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app

# Check if required files exist
echo "📁 Checking files..."
FILES=(
  "prisma/schema.prisma"
  "src/lib/prisma.ts"
  "src/lib/auth.ts"
  "app/api/auth/[...nextauth]/route.ts"
  "app/api/auth/register/route.ts"
  "app/login/page.tsx"
  "middleware.ts"
  "components/providers/SessionProvider.tsx"
  "types/next-auth.d.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file MISSING"
  fi
done

echo ""
echo "🔐 Checking environment variables..."

if grep -q "NEXTAUTH_SECRET" .env.local; then
  echo "   ✅ NEXTAUTH_SECRET found"
else
  echo "   ❌ NEXTAUTH_SECRET missing"
  echo "      Run: openssl rand -base64 32"
fi

if grep -q "DATABASE_URL" .env.local; then
  echo "   ✅ DATABASE_URL found"
else
  echo "   ❌ DATABASE_URL missing"
fi

echo ""
echo "📦 Checking dependencies..."

if [ -d "node_modules/next-auth" ]; then
  echo "   ✅ next-auth installed"
else
  echo "   ❌ next-auth missing - run: npm install"
fi

if [ -d "node_modules/@prisma/client" ]; then
  echo "   ✅ @prisma/client installed"
else
  echo "   ❌ @prisma/client missing - run: npm install"
fi

echo ""
echo "=========================================="
echo "Next steps:"
echo "1. Update NEXTAUTH_SECRET in .env.local"
echo "2. Update DATABASE_URL in .env.local"
echo "3. Run: npx prisma generate"
echo "4. Run: npx prisma migrate dev --name init"
echo "5. Run: npm run dev"
echo "6. Visit: http://localhost:3000/login"
echo ""
