'use client'

import React, { useState, useEffect } from 'react'
import { 
  Mic, MicOff, TrendingUp, TrendingDown, Brain, BarChart3, 
  FileText, Building2, Stethoscope, Globe, Search, Settings,
  Bell, User, ChevronDown, Play, Pause, Volume2, Calendar,
  Activity, DollarSign, Users, AlertCircle, CheckCircle,
  ArrowUp, ArrowDown, Minus, RefreshCw, Eye, QrCode
} from 'lucide-react'

// Mock data for demonstration
const mockMarketData = [
  { symbol: 'JNJ', company: 'Johnson & Johnson', price: 156.78, change: 2.34, changePercent: 1.52, volume: '12.5M' },
  { symbol: 'PFE', company: 'Pfizer Inc.', price: 42.91, change: -0.87, changePercent: -1.99, volume: '45.2M' },
  { symbol: 'MRNA', company: 'Moderna Inc.', price: 89.15, change: 5.67, changePercent: 6.79, volume: '23.8M' },
  { symbol: 'ABBV', company: 'AbbVie Inc.', price: 148.32, change: 0.45, changePercent: 0.31, volume: '8.9M' }
]

const mockSECFilings = [
  { company: 'Pfizer', filing: '10-Q', date: '2025-09-20', impact: 'HIGH', summary: 'Quarterly earnings with reimbursement concerns' },
  { company: 'Moderna', filing: '8-K', date: '2025-09-22', impact: 'MEDIUM', summary: 'Clinical trial update announcement' },
  { company: 'J&J', filing: '10-K', date: '2025-09-18', impact: 'HIGH', summary: 'Annual report with regulatory risks' }
]

const mockPayerData = [
  { payer: 'Anthem', change: 'Rate decrease', therapy: 'Oncology', impact: -2.3, effective: '2025-10-01' },
  { payer: 'Aetna', change: 'Coverage expansion', therapy: 'Immunology', impact: 4.7, effective: '2025-09-30' },
  { payer: 'BCBS', change: 'Prior auth update', therapy: 'Cardiology', impact: -1.2, effective: '2025-10-15' }
]

export default function FinancialAnalyticsDashboard() {
  const [isListening, setIsListening] = useState(false)
  const [voiceQuery, setVoiceQuery] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<'analyst' | 'doctor' | 'executive'>('analyst')
  const [avatarSpeaking, setAvatarSpeaking] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleVoiceCommand = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setVoiceQuery("What were today's top 10 intraday movers by volume in biotech, cross-referenced with payer transparency data?")
        setIsListening(false)
      }, 3000)
    }
  }

  const handleAvatarSpeak = () => {
    setAvatarSpeaking(true)
    setTimeout(() => setAvatarSpeaking(false), 4000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedPact Financial Analytics</h1>
                <p className="text-xs text-gray-500">Voice-First Market Intelligence</p>
              </div>
            </div>

            {/* Voice Command Center */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleVoiceCommand}
                className={`p-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-100 text-red-600 animate-voice-pulse' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="flex items-center space-x-1 cursor-pointer">
                  <User className="w-8 h-8 bg-gray-200 rounded-full p-1" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Voice Query Display */}
      {(isListening || voiceQuery) && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm font-medium text-blue-900">
                {isListening ? 'Listening...' : 'Voice Query:'}
              </span>
              <span className="text-sm text-blue-800">{voiceQuery}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Analytics Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Market Movers */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">🎯 Voice-First Market Movers</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Last updated: {currentTime.toLocaleTimeString()}</span>
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockMarketData.map((stock) => (
                  <div key={stock.symbol} className={`market-card ${stock.change > 0 ? 'positive' : 'negative'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600 truncate">{stock.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${stock.price}</p>
                        <div className={`flex items-center text-sm ${
                          stock.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span>{Math.abs(stock.change)} ({Math.abs(stock.changePercent)}%)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Volume: {stock.volume}</span>
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Domain Correlation Engine */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔗 Cross-Domain Correlations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SEC Filings */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-900">SEC EDGAR</h3>
                  </div>
                  {mockSECFilings.map((filing, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800">{filing.company}</span>
                        <span className={`sec-alert ${filing.impact.toLowerCase()}`}>{filing.impact}</span>
                      </div>
                      <p className="text-xs text-red-700 mt-1">{filing.summary}</p>
                    </div>
                  ))}
                </div>

                {/* Payer Transparency */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Payer Impact</h3>
                  </div>
                  {mockPayerData.map((payer, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">{payer.payer}</span>
                        <span className={`text-xs ${payer.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {payer.impact > 0 ? '+' : ''}{payer.impact}%
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">{payer.therapy}: {payer.change}</p>
                    </div>
                  ))}
                </div>

                {/* Clinical Correlation */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Stethoscope className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Clinical Impact</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Trial Results</span>
                      <span className="correlation-strong text-xs">Strong +0.85</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Outcomes Data</span>
                      <span className="correlation-moderate text-xs">Moderate +0.67</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Safety Signals</span>
                      <span className="correlation-weak text-xs">Weak -0.23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔮 Predictive Scenarios</h2>
              
              <div className="prediction-chart h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Interactive predictive modeling</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Run Scenario Analysis
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+12.3%</p>
                  <p className="text-sm text-gray-600">Revenue Impact</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">87%</p>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">Q4 2025</p>
                  <p className="text-sm text-gray-600">Timeline</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Avatar & Controls */}
          <div className="space-y-6">
            
            {/* AI Financial Avatar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Financial Avatar</h2>
              
              {/* Avatar Selection */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSelectedAvatar('analyst')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedAvatar === 'analyst' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Analyst
                </button>
                <button
                  onClick={() => setSelectedAvatar('doctor')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedAvatar === 'doctor' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Doctor
                </button>
                <button
                  onClick={() => setSelectedAvatar('executive')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedAvatar === 'executive' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Executive
                </button>
              </div>

              {/* Avatar Display */}
              <div className={`avatar-container h-48 mb-4 ${avatarSpeaking ? 'avatar-speaking' : ''}`}>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Brain className="w-16 h-16 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {avatarSpeaking ? 'Explaining market dynamics...' : `${selectedAvatar} avatar ready`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Avatar Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={handleAvatarSpeak}
                  className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Daily Briefing</span>
                </button>
                <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar Insights */}
              <div className="mt-4 bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  "Today's biotech sector shows strong correlation with recent FDA approvals. 
                  Payer transparency data suggests improved reimbursement rates in oncology."
                </p>
              </div>
            </div>

            {/* Mobile-First Identity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 Mobile Identity</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Analysts</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Providers</span>
                  </div>
                  <span className="text-xs text-gray-500">Offline</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Pharma</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">2 Active</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span className="text-sm">Generate QR Login</span>
              </button>
            </div>

            {/* Protocol Builder */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Quick Protocols</h2>
              
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900 text-sm">Pre-market Scan</div>
                  <div className="text-xs text-gray-600">Biotech + payer correlation</div>
                </button>
                
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900 text-sm">Earnings Analysis</div>
                  <div className="text-xs text-gray-600">SEC filings + transparency</div>
                </button>
                
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900 text-sm">Revenue Risk Check</div>
                  <div className="text-xs text-gray-600">Quarterly predictive model</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Novelty Features Footer */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Revolutionary Novel Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <Mic className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-medium">Voice-First</span>
                <span className="text-gray-600 text-xs">Market Queries</span>
              </div>
              <div className="flex flex-col items-center">
                <QrCode className="w-6 h-6 text-green-600 mb-1" />
                <span className="font-medium">Mobile Identity</span>
                <span className="text-gray-600 text-xs">QR/Barcode Auth</span>
              </div>
              <div className="flex flex-col items-center">
                <Brain className="w-6 h-6 text-purple-600 mb-1" />
                <span className="font-medium">AI Avatars</span>
                <span className="text-gray-600 text-xs">Plain Language</span>
              </div>
              <div className="flex flex-col items-center">
                <BarChart3 className="w-6 h-6 text-orange-600 mb-1" />
                <span className="font-medium">Predictive</span>
                <span className="text-gray-600 text-xs">Cross-Domain</span>
              </div>
              <div className="flex flex-col items-center">
                <Activity className="w-6 h-6 text-red-600 mb-1" />
                <span className="font-medium">Unified Hub</span>
                <span className="text-gray-600 text-xs">No Silos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
