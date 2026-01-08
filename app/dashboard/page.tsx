'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkspaceDashboard() {
  const router = useRouter();

  const mainFeatures = [
    {
      id: 'price-transparency',
      title: 'Advanced Price Transparency',
      icon: '💎',
      description: 'Navigate payer-provider negotiations with data-driven market comparisons and collaborative payment models',
      features: [
        '📊 Federal Reserve & Mathematica benchmarking',
        '🤝 Collaborative payment model design',
        '📈 5-stage contract negotiation workflow',
        '💰 Shared savings tracking'
      ],
      href: '/price-transparency',
      buttonText: 'Launch Price Transparency',
      gradient: 'from-cyan-600 to-emerald-600'
    },
    {
      id: 'provider',
      title: 'Provider Workspace',
      icon: '🏥',
      description: 'Access provider RCM tools, price transparency, and revenue optimization',
      features: [
        '🏥 Provider Analytics Dashboard',
        '💰 Revenue Cycle Management',
        '📊 Claims Processing',
        '📈 Financial Performance'
      ],
      href: '/analytics?workspace=provider',
      buttonText: 'Access Provider Tools',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      id: 'payer',
      title: 'Payer Workspace',
      icon: '🏢',
      description: 'Payer RCM foundation with competitive negotiation tools and cost management',
      features: [
        '🏢 Payer Analytics Dashboard',
        '💳 Claims Adjudication',
        '📋 Cost Management Tools',
        '🎯 Network Analytics'
      ],
      href: '/analytics?workspace=payer',
      buttonText: 'Access Payer Tools',
      gradient: 'from-green-600 to-green-800'
    },
    {
      id: 'collaboration',
      title: 'Provider-Payer Collaboration',
      icon: '🤝',
      description: 'Joint negotiation platform with shared savings and protocol royalties',
      features: [
        '🤝 Live Negotiation Platform',
        '💎 Protocol Development',
        '💰 Shared Savings Tracking',
        '📈 Joint Analytics'
      ],
      href: '/dashboard/collab',
      buttonText: 'Enter Collaboration Hub',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      id: 'analytics',
      title: 'Financial Analytics',
      icon: '📊',
      description: 'Voice-first market intelligence with predictive analytics and cross-domain correlation',
      features: [
        '📈 Real-time Market Data',
        '🎤 Voice-Activated Analytics',
        '🤖 AI-Powered Insights',
        '🔗 Cross-Domain Intelligence'
      ],
      href: '/analytics',
      buttonText: 'Open Analytics',
      gradient: 'from-indigo-600 to-indigo-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              MedPact <span className="text-blue-400">Command Center</span>
            </h1>
            <p className="text-slate-300">
              Access all healthcare revenue cycle management tools and analytics
            </p>
          </div>
          <Link
            href="/"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Featured Module - Price Transparency */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-900/40 to-emerald-900/40 backdrop-blur-sm rounded-3xl p-8 border-2 border-cyan-400/30 hover:border-cyan-400/50 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">💎</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      Advanced Price Transparency
                    </h2>
                    <p className="text-cyan-300 text-sm">FEATURED MODULE</p>
                  </div>
                </div>
                <p className="text-slate-200 mb-4 text-lg">
                  Navigate complex payer-provider negotiations with data-driven market comparisons,
                  collaborative payment models, and automated contract workflows.
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {mainFeatures[0].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href="/price-transparency"
                className="ml-6 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                Launch Module
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Other Workspace Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainFeatures.slice(1).map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 group-hover:text-slate-200 transition-colors">
                  {feature.description}
                </p>
                
                {/* Features List */}
                <div className="space-y-1 mb-4">
                  {feature.features.slice(0, 3).map((feat, index) => (
                    <div key={index} className="flex items-center text-slate-400 group-hover:text-slate-300 transition-colors text-xs">
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-blue-400 group-hover:text-blue-300 font-semibold text-sm flex items-center gap-1">
                  Open →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Current Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">$2.4M</div>
            <div className="text-slate-400">Shared Savings This Quarter</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">847K</div>
            <div className="text-slate-400">Protocol Royalties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
            <div className="text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">156</div>
            <div className="text-slate-400">Active Negotiations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
