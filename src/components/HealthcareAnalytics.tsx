"use client";

import { useState, useEffect } from "react";

interface AnalyticsData {
  revenue: {
    monthly: Array<{ month: string; amount: number; target: number }>;
    departments: Array<{ name: string; revenue: number; growth: number }>;
    trends: Array<{ period: string; collections: number; denials: number; adjustments: number }>;
  };
  protocols: {
    performance: Array<{ name: string; costSavings: number; efficiency: number; volume: number }>;
    outcomes: Array<{ protocol: string; beforeCost: number; afterCost: number; savings: number }>;
    adoption: Array<{ month: string; protocols: number; compliance: number }>;
  };
  quality: {
    metrics: Array<{ name: string; current: number; target: number; trend: 'up' | 'down' | 'stable' }>;
    satisfaction: Array<{ category: string; score: number; benchmark: number }>;
    safety: Array<{ metric: string; incidents: number; improvement: number }>;
  };
  financial: {
    kpis: Array<{ name: string; value: number; change: number; format: string }>;
    costs: Array<{ category: string; current: number; budget: number; variance: number }>;
    predictions: Array<{ month: string; predicted: number; confidence: number }>;
  };
}

export function HealthcareAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'protocols' | 'quality' | 'predictions'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading realistic healthcare data
    setTimeout(() => {
      setData({
        revenue: {
          monthly: [
            { month: 'Jan', amount: 2850000, target: 2800000 },
            { month: 'Feb', amount: 2920000, target: 2850000 },
            { month: 'Mar', amount: 3150000, target: 2900000 },
            { month: 'Apr', amount: 3080000, target: 2950000 },
            { month: 'May', amount: 3250000, target: 3000000 },
            { month: 'Jun', amount: 3420000, target: 3100000 },
            { month: 'Jul', amount: 3380000, target: 3200000 },
            { month: 'Aug', amount: 3500000, target: 3250000 },
            { month: 'Sep', amount: 3650000, target: 3300000 },
            { month: 'Oct', amount: 3580000, target: 3350000 },
            { month: 'Nov', amount: 3720000, target: 3400000 },
            { month: 'Dec', amount: 3890000, target: 3500000 }
          ],
          departments: [
            { name: 'Cardiology', revenue: 12500000, growth: 8.5 },
            { name: 'Orthopedics', revenue: 9800000, growth: 12.3 },
            { name: 'Emergency Medicine', revenue: 8900000, growth: 5.7 },
            { name: 'Surgery', revenue: 15200000, growth: 9.1 },
            { name: 'Radiology', revenue: 6700000, growth: 6.8 },
            { name: 'Laboratory', revenue: 4500000, growth: 4.2 }
          ],
          trends: [
            { period: 'Q1 2024', collections: 92.5, denials: 6.8, adjustments: 3.2 },
            { period: 'Q2 2024', collections: 94.1, denials: 5.9, adjustments: 2.8 },
            { period: 'Q3 2024', collections: 95.3, denials: 4.7, adjustments: 2.1 },
            { period: 'Q4 2024', collections: 96.2, denials: 3.8, adjustments: 1.9 }
          ]
        },
        protocols: {
          performance: [
            { name: 'Cardiac Catheterization Optimization', costSavings: 850000, efficiency: 94.2, volume: 1250 },
            { name: 'Emergency Department Triage', costSavings: 420000, efficiency: 89.7, volume: 2800 },
            { name: 'Surgical Scheduling Optimization', costSavings: 720000, efficiency: 92.1, volume: 980 },
            { name: 'Medication Administration Protocol', costSavings: 380000, efficiency: 96.5, volume: 4200 },
            { name: 'Discharge Planning Enhancement', costSavings: 540000, efficiency: 88.9, volume: 1850 }
          ],
          outcomes: [
            { protocol: 'Hip Replacement Pathway', beforeCost: 28500, afterCost: 24200, savings: 4300 },
            { protocol: 'Diabetes Management', beforeCost: 8900, afterCost: 7100, savings: 1800 },
            { protocol: 'Post-Surgical Care', beforeCost: 15600, afterCost: 12800, savings: 2800 },
            { protocol: 'Chronic Pain Management', beforeCost: 12400, afterCost: 9200, savings: 3200 }
          ],
          adoption: [
            { month: 'Jan', protocols: 24, compliance: 87.2 },
            { month: 'Feb', protocols: 26, compliance: 89.1 },
            { month: 'Mar', protocols: 28, compliance: 91.5 },
            { month: 'Apr', protocols: 31, compliance: 92.8 },
            { month: 'May', protocols: 33, compliance: 94.2 },
            { month: 'Jun', protocols: 35, compliance: 95.1 }
          ]
        },
        quality: {
          metrics: [
            { name: 'Patient Satisfaction', current: 8.7, target: 8.5, trend: 'up' },
            { name: 'Readmission Rate', current: 4.2, target: 5.0, trend: 'down' },
            { name: 'Length of Stay', current: 3.8, target: 4.2, trend: 'down' },
            { name: 'Infection Rate', current: 1.1, target: 1.5, trend: 'down' },
            { name: 'Medication Errors', current: 0.8, target: 1.0, trend: 'stable' }
          ],
          satisfaction: [
            { category: 'Overall Experience', score: 8.7, benchmark: 8.2 },
            { category: 'Communication', score: 8.9, benchmark: 8.4 },
            { category: 'Pain Management', score: 8.5, benchmark: 8.1 },
            { category: 'Discharge Process', score: 8.3, benchmark: 7.9 },
            { category: 'Facility Cleanliness', score: 9.1, benchmark: 8.6 }
          ],
          safety: [
            { metric: 'Falls per 1000 days', incidents: 2.1, improvement: -15.2 },
            { metric: 'Medication errors', incidents: 0.8, improvement: -22.5 },
            { metric: 'Hospital infections', incidents: 1.1, improvement: -18.7 },
            { metric: 'Surgical complications', incidents: 0.6, improvement: -12.3 }
          ]
        },
        financial: {
          kpis: [
            { name: 'Operating Margin', value: 12.5, change: 2.1, format: 'percentage' },
            { name: 'Days in A/R', value: 32.4, change: -3.2, format: 'days' },
            { name: 'Cost per Case', value: 8750, change: -180, format: 'currency' },
            { name: 'Net Revenue', value: 42500000, change: 2850000, format: 'currency' },
            { name: 'Collection Rate', value: 96.2, change: 1.8, format: 'percentage' },
            { name: 'Denial Rate', value: 3.8, change: -1.2, format: 'percentage' }
          ],
          costs: [
            { category: 'Personnel', current: 18500000, budget: 19200000, variance: -700000 },
            { category: 'Medical Supplies', current: 8900000, budget: 9100000, variance: -200000 },
            { category: 'Pharmaceuticals', current: 6700000, budget: 6500000, variance: 200000 },
            { category: 'Equipment', current: 2100000, budget: 2300000, variance: -200000 },
            { category: 'Facilities', current: 3800000, budget: 4000000, variance: -200000 },
            { category: 'Technology', current: 1900000, budget: 2000000, variance: -100000 }
          ],
          predictions: [
            { month: 'Nov', predicted: 3720000, confidence: 95.2 },
            { month: 'Dec', predicted: 3890000, confidence: 91.8 },
            { month: 'Jan', predicted: 3650000, confidence: 87.5 },
            { month: 'Feb', predicted: 3750000, confidence: 84.3 },
            { month: 'Mar', predicted: 4100000, confidence: 79.6 },
            { month: 'Apr', predicted: 4250000, confidence: 75.1 }
          ]
        }
      });
      setIsLoading(false);
    }, 1500);
  }, [timeRange]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">📊 Healthcare Analytics Intelligence</h3>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">📤 Export Report</button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'revenue', label: '💰 Revenue Cycle', icon: '💰' },
            { id: 'protocols', label: '⚕️ Protocol Performance', icon: '⚕️' },
            { id: 'quality', label: '⭐ Quality Metrics', icon: '⭐' },
            { id: 'predictions', label: '🔮 Predictive Analytics', icon: '🔮' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.financial.kpis.map((kpi, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-sm text-gray-600 mb-1">{kpi.name}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.format === 'currency' ? formatCurrency(kpi.value) :
                   kpi.format === 'percentage' ? formatPercentage(kpi.value) :
                   kpi.format === 'days' ? `${kpi.value} days` : kpi.value}
                </div>
                <div className={`text-xs font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change >= 0 ? '▲' : '▼'} {Math.abs(kpi.change)}
                  {kpi.format === 'percentage' ? 'pp' : kpi.format === 'currency' ? '' : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Monthly Revenue Performance</h4>
            <div className="h-64 flex items-end gap-2">
              {data.revenue.monthly.slice(-6).map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '200px' }}>
                    <div 
                      className="w-full bg-blue-600 rounded-t absolute bottom-0"
                      style={{ height: `${(month.amount / 4000000) * 100}%` }}
                    ></div>
                    <div 
                      className="w-full border-2 border-dashed border-green-500 absolute bottom-0"
                      style={{ height: `${(month.target / 4000000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                  <div className="text-xs font-medium">{formatCurrency(month.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional tab contents would continue here with similar structure */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Revenue Cycle Performance</h4>
          <div className="text-gray-600">Revenue cycle analytics and detailed financial metrics...</div>
        </div>
      )}

      {activeTab === 'protocols' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Protocol Performance Analysis</h4>
          <div className="text-gray-600">Clinical protocol outcomes and cost optimization results...</div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Quality Metrics Dashboard</h4>
          <div className="text-gray-600">Patient safety indicators and satisfaction scores...</div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Predictive Analytics & AI Insights</h4>
          <div className="text-gray-600">Machine learning predictions and optimization recommendations...</div>
        </div>
      )}
    </div>
  );
}
