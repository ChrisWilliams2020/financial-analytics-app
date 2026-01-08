#!/bin/bash

echo "🚀 MedPact Analytics - Deployment Readiness Check"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

echo ""
echo "1. Environment Setup"
echo "===================="

# Check Node.js version
NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
print_info "npm version: $NPM_VERSION"

# Check for required files
echo ""
echo "2. Required Files"
echo "================="

[ -f "package.json" ] && print_status 0 "package.json exists" || print_status 1 "package.json missing"
[ -f "next.config.js" ] && print_status 0 "next.config.js exists" || print_status 1 "next.config.js missing"
[ -f "tsconfig.json" ] && print_status 0 "tsconfig.json exists" || print_status 1 "tsconfig.json missing"
[ -f "tailwind.config.js" ] && print_status 0 "tailwind.config.js exists" || print_status 1 "tailwind.config.js missing"

echo ""
echo "3. Dependencies"
echo "==============="

print_info "Installing dependencies..."
npm install --silent
if [ $? -eq 0 ]; then
    print_status 0 "Dependencies installed successfully"
else
    print_status 1 "Failed to install dependencies"
fi

echo ""
echo "4. TypeScript Check"
echo "==================="

print_info "Running TypeScript type checking..."
npm run type-check --silent
if [ $? -eq 0 ]; then
    print_status 0 "TypeScript compilation successful"
else
    print_status 1 "TypeScript compilation failed"
fi

echo ""
echo "5. Linting"
echo "=========="

print_info "Running ESLint..."
npm run lint --silent
if [ $? -eq 0 ]; then
    print_status 0 "Linting passed"
else
    print_warning "Linting issues found (check above)"
fi

echo ""
echo "6. Build Test"
echo "============="

print_info "Testing production build..."
npm run build --silent
if [ $? -eq 0 ]; then
    print_status 0 "Production build successful"
    
    # Check build output
    if [ -d ".next" ]; then
        BUNDLE_SIZE=$(du -sh .next | cut -f1)
        print_info "Build size: $BUNDLE_SIZE"
    fi
else
    print_status 1 "Production build failed"
fi

echo ""
echo "7. Environment Variables"
echo "========================"

[ -f ".env.production" ] && print_status 0 ".env.production exists" || print_warning ".env.production missing"
[ -f ".env.local" ] && print_status 0 ".env.local exists" || print_warning ".env.local missing"

echo ""
echo "8. Security Checks"
echo "=================="

# Check for common security issues
if grep -r "console.log" src/ --include="*.tsx" --include="*.ts" > /dev/null; then
    print_warning "Console.log statements found (should be removed for production)"
else
    print_status 0 "No console.log statements found"
fi

if grep -r "TODO\|FIXME\|HACK" src/ --include="*.tsx" --include="*.ts" > /dev/null; then
    print_warning "TODO/FIXME/HACK comments found"
else
    print_status 0 "No TODO/FIXME/HACK comments found"
fi

echo ""
echo "9. Performance Optimizations"
echo "============================"

if grep -q "removeConsole.*production" next.config.js; then
    print_status 0 "Console removal configured for production"
else
    print_warning "Console removal not configured"
fi

if grep -q "compress.*true" next.config.js; then
    print_status 0 "Compression enabled"
else
    print_warning "Compression not enabled"
fi

echo ""
echo "10. Deployment Summary"
echo "====================="

echo ""
print_info "🎯 Deployment Instructions:"
echo "1. Set production environment variables in .env.production"
echo "2. Configure your hosting platform (Vercel/Netlify/AWS)"
echo "3. Set up CI/CD pipeline if needed"
echo "4. Configure domain and SSL certificates"
echo "5. Set up monitoring and analytics"
echo ""

print_info "🚀 Ready to deploy with: npm run build && npm start"

echo ""
echo "================================================="
echo "✨ MedPact Analytics Deployment Check Complete!"
echo "================================================="
