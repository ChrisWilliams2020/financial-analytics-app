import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Subscription Plans
export const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 299,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    features: [
      '5 users',
      '50 research queries/month',
      'Basic analytics',
      'Email support',
    ],
    maxUsers: 5,
    maxQueries: 50,
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 999,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional',
    features: [
      '20 users',
      '500 research queries/month',
      'Advanced analytics',
      'Research Engine access',
      'Priority support',
      'Data export',
    ],
    maxUsers: 20,
    maxQueries: 500,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 0, // Custom pricing
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: [
      'Unlimited users',
      'Unlimited queries',
      'White-label options',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
    ],
    maxUsers: -1, // unlimited
    maxQueries: -1, // unlimited
  },
}

export type PlanType = keyof typeof PLANS
