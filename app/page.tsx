'use client';

import AdvancedAnalytics from './components/AdvancedAnalytics';
import { TrendingUp, DollarSign, Shield, Zap, Brain, FileText, Database, CheckCircle, Upload, BarChart3, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header Navigation */}
      <div className="relative border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            MedPact
          </div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Login / Sign Up</span>
          </Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-8 pt-20 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">AI-Powered Revenue Intelligence</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              MedPact Financial
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Analytics Platform
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Upload your practice management data and let our AI detect underpayments, verify contracts, 
              and generate professional appeals automatically.
            </p>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">98%</div>
                <div className="text-slate-400 text-sm">Detection Accuracy</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400">$2.5M</div>
                <div className="text-slate-400 text-sm">Revenue Recovered</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400">24hrs</div>
                <div className="text-slate-400 text-sm">Avg Processing Time</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-400">1000+</div>
                <div className="text-slate-400 text-sm">Practices Using</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:scale-105 transition-all">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ML Detection</h3>
              <p className="text-slate-300 text-sm mb-4">
                Advanced machine learning algorithms detect underpayment patterns across all payers
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Risk scoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Pattern recognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>AI recommendations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 hover:scale-105 transition-all">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Contract Verification</h3>
              <p className="text-slate-300 text-sm mb-4">
                Automatically verify every payment against your payer contracts
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>100% payment audit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Compliance tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Variance analysis</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:scale-105 transition-all">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto Appeals</h3>
              <p className="text-slate-300 text-sm mb-4">
                Generate professional appeal letters with supporting documentation
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>One-click generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Priority tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Deadline management</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Integration Logos */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16">
            <h3 className="text-center text-slate-400 text-sm font-medium mb-6">
              INTEGRATES WITH YOUR PRACTICE MANAGEMENT SYSTEM
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">🏥</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">⚕️</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">💊</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">🔬</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">🩺</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">💻</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">🏨</div>
              <div className="text-4xl opacity-60 hover:opacity-100 transition-opacity">🚑</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Dashboard */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <AdvancedAnalytics />
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Recover Your Revenue?
          </h2>
          <p className="text-blue-100 mb-8">
            Upload your first file and discover underpayments in minutes
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <a
              href="/ai-upload"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>AI File Upload</span>
            </a>
            <a
              href="/analytics"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Analytics</span>
            </a>
            <a
              href="/dashboard"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-all hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
