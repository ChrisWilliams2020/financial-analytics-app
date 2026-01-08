#!/bin/bash

echo "🚀 MedPact Analytics - Deploy to Vercel"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found"
  echo "Please run this script from the financial-analytics-app directory"
  exit 1
fi

echo "📋 Pre-deployment checklist..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Check for required files
echo "Checking required files..."
FILES=(
  "prisma/schema.prisma"
  "src/lib/auth.ts"
  "src/lib/stripe.ts"
  "app/api/auth/[...nextauth]/route.ts"
  "middleware.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file MISSING"
    exit 1
  fi
done

echo ""
echo "========================================"
echo "Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Make sure you have a Supabase database ready"
echo "2. Have your Stripe API keys ready"
echo "3. Run: vercel"
echo "4. Follow prompts to link/create project"
echo "5. Add environment variables in Vercel dashboard"
echo ""
echo "To deploy now, run: vercel --prod"
echo "========================================"
