'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CollaborationWorkspace() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('negotiations');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Provider-Payer Collaboration</h1>
              <p className="text-slate-300">Joint negotiation and protocol development platform</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Live Negotiations</h2>
            
            {/* Active Negotiations */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">Cardiology Protocol</h3>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-slate-300 mb-4">Negotiating shared savings for cardiac care pathways</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Current Offer:</span>
                    <span className="text-green-400">15% shared savings</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Protocol Adherence:</span>
                    <span className="text-blue-400">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Est. Savings:</span>
                    <span className="text-yellow-400">$450K annually</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">Diabetes Management</h3>
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Pending</span>
                </div>
                <p className="text-slate-300 mb-4">Comprehensive diabetes care protocol development</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Proposed Savings:</span>
                    <span className="text-green-400">18% reduction</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="text-blue-400">6 months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Est. Impact:</span>
                    <span className="text-yellow-400">$320K annually</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}