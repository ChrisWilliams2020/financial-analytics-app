# File Structure Overview

## Complete React/Next.js Conversion

```
react-converted/
│
├── README.md                                    # Integration guide
├── LANDING_PAGE_INTEGRATION.tsx                 # Code snippet for landing page
│
├── components/
│   └── StageHeader.tsx                         # Reusable header component
│
└── app/
    └── price-transparency/
        │
        ├── page.tsx                            # 🏠 Entry: Provider/Payer selection
        │
        ├── provider/                           # 👨‍⚕️ Provider Workflow
        │   ├── stage1/
        │   │   └── page.tsx                   # 📤 Data Upload/Integration
        │   ├── stage2/
        │   │   └── page.tsx                   # 📊 Market Comparison
        │   ├── stage3/
        │   │   └── page.tsx                   # 📈 Modeling & KPIs
        │   ├── stage4/
        │   │   └── page.tsx                   # 💼 Negotiation & Drafting
        │   └── stage5/
        │       └── page.tsx                   # ✅ Review & Sign-off
        │
        ├── payer/                             # 🏥 Payer Workflow
        │   ├── stage1/
        │   │   └── page.tsx                   # 📤 Data Upload/Integration
        │   ├── stage2/
        │   │   └── page.tsx                   # 📊 Market Comparison
        │   ├── stage3/
        │   │   └── page.tsx                   # 📈 Modeling & KPIs
        │   ├── stage4/
        │   │   └── page.tsx                   # 💼 Negotiation & Drafting
        │   └── stage5/
        │       └── page.tsx                   # ✅ Review & Sign-off
        │
        ├── collaborative/
        │   └── page.tsx                       # 🤝 Payment Options Hub
        │
        └── collab/
            ├── shared-revenue/
            │   └── page.tsx                   # 💰 Shared Revenue Model
            ├── enhanced-cpt/
            │   └── page.tsx                   # 📋 Enhanced CPT Reimbursement
            └── risk-sharing/
                └── page.tsx                   # 🛡️ Risk Sharing Model
```

## Navigation Flow

```
Landing Page
    └─> /price-transparency (Entry)
        │
        ├─> Provider Path
        │   ├─> /provider/stage1 → stage2 → stage3 → /collaborative
        │   ├─> /provider/stage4 → /collaborative
        │   └─> /provider/stage5 → /collaborative
        │
        └─> Payer Path
            ├─> /payer/stage1 → stage2 → stage3 → /collaborative
            ├─> /payer/stage4 → /collaborative
            └─> /payer/stage5 → /collaborative

Collaborative Options Hub (/collaborative)
    ├─> /collab/shared-revenue
    ├─> /collab/enhanced-cpt
    └─> /collab/risk-sharing
```

## Component Dependencies

```
All Pages depend on:
├── @/components/ui/card         # shadcn/ui Card component
├── @/components/ui/button       # shadcn/ui Button component
├── @/components/ui/input        # shadcn/ui Input component (forms only)
├── @/components/ui/label        # shadcn/ui Label component (forms only)
├── next/link                    # Next.js Link for navigation
├── lucide-react                 # Icons (ArrowRight, Upload, etc.)
└── StageHeader component        # Custom reusable header
```

## File Count Summary

- **Total Pages**: 17
- **Provider Stages**: 5
- **Payer Stages**: 5
- **Collaborative Models**: 4 (hub + 3 models)
- **Shared Components**: 1 (StageHeader)
- **Entry Page**: 1
- **Documentation**: 2 (README + Integration guide)

## Original Blazor Mapping

| Blazor File                           | React File                                        |
|---------------------------------------|---------------------------------------------------|
| Pages/Entry.razor                     | app/price-transparency/page.tsx                   |
| Pages/Provider/Stage1.razor           | app/price-transparency/provider/stage1/page.tsx   |
| Pages/Provider/Stage2.razor           | app/price-transparency/provider/stage2/page.tsx   |
| Pages/Provider/Stage3.razor           | app/price-transparency/provider/stage3/page.tsx   |
| Pages/Provider/Stage4.razor           | app/price-transparency/provider/stage4/page.tsx   |
| Pages/Provider/Stage5.razor           | app/price-transparency/provider/stage5/page.tsx   |
| Pages/Payer/Stage1.razor              | app/price-transparency/payer/stage1/page.tsx      |
| Pages/Payer/Stage2.razor              | app/price-transparency/payer/stage2/page.tsx      |
| Pages/Payer/Stage3.razor              | app/price-transparency/payer/stage3/page.tsx      |
| Pages/Payer/Stage4.razor              | app/price-transparency/payer/stage4/page.tsx      |
| Pages/Payer/Stage5.razor              | app/price-transparency/payer/stage5/page.tsx      |
| Pages/Shared/Collaborative.razor      | app/price-transparency/collaborative/page.tsx     |
| Pages/Shared/SharedRevenue.razor      | app/price-transparency/collab/shared-revenue/page.tsx |
| Pages/Shared/EnhancedCpt.razor        | app/price-transparency/collab/enhanced-cpt/page.tsx |
| Pages/Shared/RiskSharing.razor        | app/price-transparency/collab/risk-sharing/page.tsx |
| Pages/Shared/StageHeader.razor        | components/StageHeader.tsx                        |
| Native/MedPactNative.cs               | (Not converted - backend/API functionality)       |

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion (for future enhancements)

## Color Scheme

- **Provider**: Cyan (#0891b2) - Primary actions and highlights
- **Payer**: Emerald (#059669) - Primary actions and highlights
- **Neutral**: Slate - Text and backgrounds
- **Gradients**: cyan-600 → emerald-600 for CTAs
