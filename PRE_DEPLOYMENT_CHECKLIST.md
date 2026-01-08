# 🚀 Pre-Deployment Checklist

**Date:** December 22, 2025  
**Target:** Local Development Environment  
**Components:** 4 New Research Engine Integrations

---

## ✅ Essential Checks Before `npm run dev`

### 1. **Verify All Dependencies Are Installed**

```bash
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app

# Check if node_modules exists
ls -la node_modules | head -20

# If not, install dependencies
npm install

# Specifically verify shadcn/ui components exist
ls -la src/components/ui/
```

**Required Dependencies:**
- ✅ React 18.2.0+
- ✅ Next.js 14.0.0+
- ✅ TypeScript 5.9.3+
- ✅ lucide-react (for icons)
- ✅ shadcn/ui components (Card, Button, Input, Badge)

**Install if missing:**
```bash
npm install lucide-react
npx shadcn-ui@latest add card button input badge
```

---

### 2. **Verify Research Engine API is Running**

```bash
# Check if API is already running
curl http://localhost:3001/api/stats

# If not running, start it
cd ~/Downloads/medpact-research-engine
node quick-start-api.js &

# Verify it's running
sleep 2
curl http://localhost:3001/api/stats
```

**Expected Output:**
```json
{
  "total_entities": 5,
  "total_searches": 5,
  "uptime_seconds": 1234,
  "last_search": "2025-12-22T..."
}
```

**If API fails to start:**
```bash
# Install dependencies
cd ~/Downloads/medpact-research-engine
npm install
npm install cors

# Try again
node quick-start-api.js &
```

---

### 3. **Check Component Files Exist**

```bash
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app

# Verify all 5 files were created
ls -lh src/lib/medpact-research-client.ts
ls -lh src/components/FacilityIntelligence.tsx
ls -lh src/components/EnhancedPracticesDirectory.tsx
ls -lh src/components/MarketIntelligenceDashboard.tsx
ls -lh src/components/ContractNegotiationIntelligence.tsx
```

**Expected:** All 5 files should exist with sizes > 5KB each

---

### 4. **Verify shadcn/ui Components**

```bash
# Check if ui components directory exists
ls -la src/components/ui/

# Required files:
# - card.tsx
# - button.tsx
# - input.tsx
# - badge.tsx
```

**If missing, install:**
```bash
npx shadcn-ui@latest init  # If first time
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
```

---

### 5. **TypeScript Configuration Check**

```bash
# Verify tsconfig.json has proper paths
cat tsconfig.json | grep -A 5 "paths"
```

**Should include:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**If missing, add to tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 6. **Test API Connection from Client**

```bash
# Quick test of the TypeScript client
cat > test-client.ts << 'TESTEOF'
import MedPactResearchClient from './src/lib/medpact-research-client';

async function test() {
  const client = new MedPactResearchClient('http://localhost:3001');
  
  try {
    const stats = await client.getStats();
    console.log('✅ API Connection Successful:', stats);
    
    const facility = await client.searchFacility('390200');
    console.log('✅ Facility Search Successful:', facility.name);
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
  }
}

test();
TESTEOF

# Run test
npx ts-node test-client.ts
```

---

### 7. **Add Sample Data to Your Pages**

**For Analytics Page:**
Add CMS certifications to your facility data:

```typescript
// app/price-transparency/analytics/page.tsx

const facilities = [
  {
    name: "Penn Presbyterian Medical Center",
    tin: "12-3456789",
    cmsCertification: "390200",  // ← ADD THIS
    // ... other fields
  },
  {
    name: "Pennsylvania Hospital",
    tin: "12-9876543",
    cmsCertification: "390006",  // ← ADD THIS
    // ... other fields
  }
];
```

**For Market Intelligence:**
Add payer contract numbers:

```typescript
const payerContracts = [
  "H1234",  // Independence Blue Cross
  "H5678",  // Aetna Better Health
];
```

---

### 8. **Build Test Before Dev Server**

```bash
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app

# Try building to catch TypeScript errors
npm run build

# If build fails, check errors and fix
# Common issues:
# - Missing imports
# - Type mismatches
# - Missing dependencies
```

---

### 9. **Check for Port Conflicts**

```bash
# Check if port 3000 is in use
lsof -i :3000

# Check if port 3001 is in use (should be Research Engine API)
lsof -i :3001

# Kill any conflicting processes if needed
kill -9 <PID>
```

---

### 10. **Environment Variables**

```bash
# Create .env.local if it doesn't exist
cat > .env.local << 'ENVEOF'
# Research Engine API
NEXT_PUBLIC_RESEARCH_ENGINE_API_URL=http://localhost:3001

# Optional: Enable debug logging
NEXT_PUBLIC_DEBUG=true
ENVEOF
```

Then update components to use env variable:

```typescript
const API_URL = process.env.NEXT_PUBLIC_RESEARCH_ENGINE_API_URL || 'http://localhost:3001';
const client = new MedPactResearchClient(API_URL);
```

---

## 🔧 Quick Fixes for Common Issues

### Issue: "Module not found: Can't resolve '@/components/ui/card'"

**Fix:**
```bash
npx shadcn-ui@latest add card button input badge
```

---

### Issue: "fetch failed" or "ECONNREFUSED"

**Fix:**
```bash
# Research Engine API not running
cd ~/Downloads/medpact-research-engine
node quick-start-api.js &

# Wait 2 seconds
sleep 2

# Test
curl http://localhost:3001/api/stats
```

---

### Issue: TypeScript errors about missing types

**Fix:**
```bash
# Install type definitions
npm install --save-dev @types/node @types/react @types/react-dom

# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P) → "TypeScript: Restart TS Server"
```

---

### Issue: "Cannot find module 'lucide-react'"

**Fix:**
```bash
npm install lucide-react
```

---

### Issue: Components don't show data

**Fix:**
1. Check browser console for errors
2. Verify API is running: `curl http://localhost:3001/api/stats`
3. Check Network tab in DevTools for failed requests
4. Verify CMS certifications are correct
5. Check component props are being passed correctly

---

## 📝 Pre-Launch Script

**Run this complete check:**

```bash
#!/bin/bash

echo "🔍 Pre-Deployment Checklist"
echo "================================"

cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app

echo ""
echo "1. Checking Node modules..."
if [ -d "node_modules" ]; then
  echo "   ✅ node_modules exists"
else
  echo "   ❌ node_modules missing - run: npm install"
  exit 1
fi

echo ""
echo "2. Checking Research Engine API..."
if curl -s http://localhost:3001/api/stats > /dev/null 2>&1; then
  echo "   ✅ API is running"
else
  echo "   ❌ API not running - start with: cd ~/Downloads/medpact-research-engine && node quick-start-api.js &"
  exit 1
fi

echo ""
echo "3. Checking component files..."
FILES=(
  "src/lib/medpact-research-client.ts"
  "src/components/FacilityIntelligence.tsx"
  "src/components/EnhancedPracticesDirectory.tsx"
  "src/components/MarketIntelligenceDashboard.tsx"
  "src/components/ContractNegotiationIntelligence.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file missing"
    exit 1
  fi
done

echo ""
echo "4. Checking shadcn/ui components..."
UI_COMPONENTS=("card" "button" "input" "badge")
for comp in "${UI_COMPONENTS[@]}"; do
  if [ -f "src/components/ui/${comp}.tsx" ]; then
    echo "   ✅ ${comp}.tsx"
  else
    echo "   ⚠️  ${comp}.tsx missing - run: npx shadcn-ui@latest add ${comp}"
  fi
done

echo ""
echo "================================"
echo "✨ Pre-deployment checks complete!"
echo ""
echo "Next steps:"
echo "1. npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Navigate to your analytics page"
echo "4. Verify components load correctly"
echo ""
```

**Save and run:**
```bash
chmod +x pre-deploy-check.sh
./pre-deploy-check.sh
```

---

## 🎯 Recommended Testing Flow

### Step 1: Start Services
```bash
# Terminal 1: Research Engine API
cd ~/Downloads/medpact-research-engine
node quick-start-api.js

# Terminal 2: Financial Analytics App
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app
npm run dev
```

### Step 2: Test Individual Components

**Test FacilityIntelligence:**
1. Navigate to analytics page
2. Check if facility intelligence card appears
3. Verify quality rating shows (1-5 stars)
4. Verify HCAHPS scores display
5. Click "Refresh" button to test API calls

**Test EnhancedPracticesDirectory:**
1. Navigate to practices page
2. Click "Enrich All" button
3. Verify intelligence cards appear for each facility
4. Test search functionality
5. Test individual "Load Intelligence" buttons

**Test MarketIntelligenceDashboard:**
1. Navigate to market intelligence page
2. Verify summary cards show data
3. Check facility list displays correctly
4. Check payer list displays correctly
5. Test "Refresh" button

**Test ContractNegotiationIntelligence:**
1. Navigate to contract negotiation page
2. Verify leverage indicator shows (Strong/Moderate/Weak)
3. Check facility strengths list
4. Check payer insights list
5. Verify key metrics dashboard displays

### Step 3: Browser Console Checks

Open DevTools (F12) and verify:
- ✅ No console errors
- ✅ API calls return 200 status
- ✅ Data is being fetched correctly
- ✅ No CORS errors
- ✅ No missing module errors

### Step 4: Network Tab Checks

Verify API calls:
- ✅ POST http://localhost:3001/api/search → 200 OK
- ✅ GET http://localhost:3001/api/stats → 200 OK
- ✅ Response times < 500ms
- ✅ Response data is JSON format

---

## 🚨 Critical Warnings

### Warning 1: API Must Be Running First
⚠️ **Always start Research Engine API BEFORE the Next.js app**

```bash
# CORRECT ORDER:
# 1. Start API first
cd ~/Downloads/medpact-research-engine && node quick-start-api.js &

# 2. Wait 2 seconds
sleep 2

# 3. Start Next.js
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app && npm run dev
```

### Warning 2: Mock Data Limitations
⚠️ **Current API uses mock data**
- Only responds to specific CMS certifications (390200, 390006, etc.)
- Limited to 5 sample entities
- Not production-ready for real facility lookups

**To use with your actual facilities:**
You'll need to either:
1. Add your facility IDs to the mock data in `quick-start-api.js`
2. Connect to real CMS/FDA APIs (see MEDPACT_APPS_INTEGRATION_GUIDE.md)

### Warning 3: CORS Issues
⚠️ **If you see CORS errors in browser console:**

```bash
# Verify cors is installed
cd ~/Downloads/medpact-research-engine
npm install cors

# Restart API
killall node
node quick-start-api.js &
```

### Warning 4: TypeScript Strict Mode
⚠️ **Components use TypeScript strict mode**
- All props must be properly typed
- Optional props must include `?` or default values
- May see errors if your existing code uses loose typing

---

## 📊 Performance Expectations

**Expected Load Times:**
- FacilityIntelligence: < 500ms first load, < 200ms cached
- EnhancedPracticesDirectory: < 1s for 10 facilities, < 3s for 50
- MarketIntelligenceDashboard: < 1.5s for 5 facilities + 3 payers
- ContractNegotiationIntelligence: < 800ms

**If slower:**
- Check Research Engine API performance
- Verify network isn't throttled
- Check for console errors
- Consider adding loading skeletons

---

## 🎨 UI/UX Recommendations

### 1. **Add Loading Skeletons**
All components have loading states, but you might want to add skeleton screens for better UX:

```typescript
{loading && (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
)}
```

### 2. **Add Error Boundaries**
Wrap components in error boundaries to prevent crashes:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <FacilityIntelligence cmsCertification="390200" />
</ErrorBoundary>
```

### 3. **Add Toast Notifications**
For better user feedback on actions:

```bash
npm install sonner

# In your layout:
import { Toaster } from 'sonner';
<Toaster />

# In components:
import { toast } from 'sonner';
toast.success('Intelligence loaded successfully!');
```

### 4. **Add Analytics Tracking**
Track component usage:

```typescript
useEffect(() => {
  // Track when component loads
  analytics.track('FacilityIntelligence Loaded', {
    cmsCertification,
    facilityName
  });
}, []);
```

---

## 📈 Next Steps After Local Testing

### Phase 1: Local Testing (Today)
- ✅ Verify all components render
- ✅ Test all interactive features
- ✅ Check responsive design
- ✅ Test error states

### Phase 2: Data Enhancement (This Week)
- Add real CMS certifications to your facility data
- Add payer contract numbers
- Test with multiple facilities
- Verify data accuracy

### Phase 3: Production Prep (Next Week)
- Replace mock data with real API connections
- Setup PostgreSQL database
- Add authentication
- Implement rate limiting
- Add monitoring

### Phase 4: Deploy (Week 3-4)
- Deploy to staging environment
- User acceptance testing
- Performance optimization
- Deploy to production

---

## ✅ Final Checklist

Before running `npm run dev`:

- [ ] Research Engine API is running on port 3001
- [ ] All npm dependencies installed
- [ ] shadcn/ui components installed
- [ ] All 5 component files exist
- [ ] TypeScript configuration is correct
- [ ] No port conflicts
- [ ] .env.local created (optional)
- [ ] Test script runs successfully
- [ ] Browser DevTools ready
- [ ] Coffee/tea prepared ☕

---

## 🚀 Ready to Launch?

**Run these commands in order:**

```bash
# 1. Start Research Engine API
cd ~/Downloads/medpact-research-engine
node quick-start-api.js &

# 2. Wait for API to start
sleep 2

# 3. Test API
curl http://localhost:3001/api/stats

# 4. Start Financial Analytics App
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app
npm run dev

# 5. Open browser
open http://localhost:3000
```

**You should see:**
- ✅ Next.js app running on port 3000
- ✅ Research Engine API running on port 3001
- ✅ No errors in terminal
- ✅ Components loading with data

---

**Good luck with your deployment! 🎉**

If you encounter any issues, check this document first. Most problems are covered in the "Quick Fixes" section.
