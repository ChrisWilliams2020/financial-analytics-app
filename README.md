# Price Transparency Module - React/Next.js Conversion

This directory contains the converted React/Next.js components from the original Blazor/.razor starter pack.

## 📁 Directory Structure

```
react-converted/
├── app/
│   └── price-transparency/
│       ├── page.tsx                    # Entry page (Provider/Payer selection)
│       ├── provider/
│       │   ├── stage1/page.tsx        # Data Upload/Integration
│       │   ├── stage2/page.tsx        # Market Comparison
│       │   ├── stage3/page.tsx        # Modeling & KPIs
│       │   ├── stage4/page.tsx        # Negotiation & Drafting
│       │   └── stage5/page.tsx        # Review & Sign-off
│       ├── payer/
│       │   ├── stage1/page.tsx        # Data Upload/Integration
│       │   ├── stage2/page.tsx        # Market Comparison
│       │   ├── stage3/page.tsx        # Modeling & KPIs
│       │   ├── stage4/page.tsx        # Negotiation & Drafting
│       │   └── stage5/page.tsx        # Review & Sign-off
│       ├── collaborative/page.tsx      # Payment Options Hub
│       └── collab/
│           ├── shared-revenue/page.tsx
│           ├── enhanced-cpt/page.tsx
│           └── risk-sharing/page.tsx
└── components/
    └── StageHeader.tsx                 # Reusable stage header component
```

## 🚀 Integration Steps

### Step 1: Copy Files to Your Enterprise Pack

Copy the entire `react-converted` directory into your `medpact_mvp_enterprise_pack` project:

```bash
cp -r react-converted/* /path/to/medpact_mvp_enterprise_pack/
```

### Step 2: Update Import Paths

The components use shadcn/ui components. Make sure your project has these installed:

```bash
npx shadcn-ui@latest add card button input label
```

If your project structure differs, update the import paths in all files:
- Change `@/components/ui/*` to match your UI component paths
- Change `@/react-converted/components/StageHeader` to match where you place StageHeader.tsx

### Step 3: Add Launch Button to Landing Page

Add this to your MedPact RCM landing page (after the Platform Modules section):

```tsx
{/* Price Transparency Module */}
<section className="py-14">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <Card className="rounded-3xl bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-950 dark:to-emerald-950 border-2 border-cyan-200">
      <CardContent className="py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">
              Advanced Price Transparency
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Navigate complex payer-provider negotiations with data-driven
              market comparisons, collaborative payment models, and automated
              contract workflows.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                Federal Reserve & Mathematica benchmarking
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                Collaborative payment model design
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                5-stage contract negotiation workflow
              </li>
            </ul>
            <Link href="/price-transparency">
              <Button size="lg" className="rounded-2xl px-6 py-6 text-base font-bold bg-gradient-to-r from-cyan-600 to-emerald-600">
                Launch Price Transparency <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/70 shadow-xl">
              <h4 className="font-semibold mb-3">Workflow Stages</h4>
              <div className="space-y-2 text-sm">
                {["Data Upload", "Market Comparison", "Modeling & KPIs", "Negotiation", "Sign-off"].map((stage, idx) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-600 to-emerald-600 text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</section>
```

### Step 4: Update Navigation (Optional)

Add a navigation item to your header nav array:

```tsx
{ href: "/price-transparency", label: "Price Transparency" }
```

### Step 5: Configure API Endpoints

Update the API endpoint placeholders in:
- `provider/stage1/page.tsx` - `/api/contracts/upload`
- `provider/stage2/page.tsx` - `/api/market/benchmark`
- All collaborative model pages - Wire to your backend

## 🎨 Styling

All components use:
- Tailwind CSS classes
- shadcn/ui components (Card, Button, Input, Label)
- Gradient themes: cyan-600 → emerald-600
- Rounded corners (rounded-2xl, rounded-3xl)
- Dark mode support

## 🔧 Customization

### Colors
The Provider side uses **cyan** accents, while the Payer side uses **emerald** accents. You can customize these in each component.

### API Integration
Search for `TODO: Replace with actual API endpoint` comments in the code to wire up your backend.

### Content
Stages 3, 4, and 5 are placeholder pages. Add your actual visualizations, KPI dashboards, and workflow tools to these pages.

## ✅ Testing Checklist

- [ ] Copy files to enterprise pack
- [ ] Install shadcn/ui components
- [ ] Update import paths
- [ ] Add launch button to landing page
- [ ] Test navigation flow
- [ ] Verify responsive design
- [ ] Test dark mode
- [ ] Wire up API endpoints
- [ ] Add custom content to placeholder stages

## 📝 Notes

- TypeScript errors about missing modules are expected until you copy files to your main project
- The `StageHeader` component is reusable across all stages
- All forms include basic validation and loading states
- File upload is configured for files up to 100MB

## 🚦 Next Steps

1. Copy files to your main project
2. Test the entry page at `/price-transparency`
3. Customize the placeholder stages with your actual features
4. Integrate with your backend APIs
5. Add authentication/authorization as needed
6. Deploy and test in production

---

For questions or issues, refer to the original Blazor components in `src/MedPact.PriceTransparency/`.
# Updated Wed Jan 14 11:53:51 EST 2026

