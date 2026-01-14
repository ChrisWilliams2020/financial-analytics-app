export const dynamic = 'force-dynamic'
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PLANS } from '@/lib/stripe';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planType: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(planType);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-300">
            Choose the plan that's right for your healthcare organization
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 hover:border-blue-400/50 transition-all">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-blue-400">$299</span>
                <span className="text-slate-300">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.STARTER.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('STARTER')}
              disabled={loading === 'STARTER'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading === 'STARTER' ? 'Loading...' : 'Get Started'}
            </button>
          </div>

          {/* Professional Plan - Featured */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl border-2 border-blue-400 p-8 relative transform scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">$999</span>
                <span className="text-blue-100">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.PROFESSIONAL.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('PROFESSIONAL')}
              disabled={loading === 'PROFESSIONAL'}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading === 'PROFESSIONAL' ? 'Loading...' : 'Get Started'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 hover:border-blue-400/50 transition-all">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl font-bold text-blue-400">Custom</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.ENTERPRISE.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push('/contact')}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 text-center">
          <p className="text-slate-300 mb-4">
            All plans include 14-day free trial • No credit card required
          </p>
          <p className="text-slate-400 text-sm">
            Have questions? <a href="mailto:support@medpact.com" className="text-blue-400 hover:underline">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
