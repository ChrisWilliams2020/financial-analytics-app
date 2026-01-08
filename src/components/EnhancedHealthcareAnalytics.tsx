"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  DollarSign,
  Users,
  Clock,
  Target,
  Zap,
  Download,
  Filter,
  Calendar
} from "lucide-react";
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

export function EnhancedHealthcareAnalytics() {
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
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
    { id: 'revenue', label: 'Revenue Cycle', icon: DollarSign, color: 'text-green-600' },
    { id: 'protocols', label: 'Protocol Performance', icon: Target, color: 'text-purple-600' },
    { id: 'quality', label: 'Quality Metrics', icon: Users, color: 'text-orange-600' },
    { id: 'predictions', label: 'Predictive Analytics', icon: Zap, color: 'text-pink-600' }
  ];

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
            <div className="grid grid-cols-6 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Analytics Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg text-white p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              📊
            </motion.div>
            Healthcare Analytics Intelligence
          </motion.h3>
          <div className="flex items-center gap-4">
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="7d" className="text-gray-900">Last 7 days</option>
              <option value="30d" className="text-gray-900">Last 30 days</option>
              <option value="90d" className="text-gray-900">Last 90 days</option>
              <option value="1y" className="text-gray-900">Last year</option>
            </motion.select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
            >
              <Download size={16} />
              Export Report
            </motion.button>
          </div>
        </div>

        {/* Enhanced Analytics Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <IconComponent size={18} className={activeTab === tab.id ? tab.color : 'text-current'} />
                <span className="font-medium text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Enhanced Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {data.financial.kpis.map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className={`w-2 h-2 rounded-full ${kpi.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">{kpi.name}</div>
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      className="text-2xl font-bold text-gray-900"
                    >
                      {kpi.format === 'currency' ? formatCurrency(kpi.value) :
                       kpi.format === 'percentage' ? formatPercentage(kpi.value) :
                       kpi.format === 'days' ? `${kpi.value} days` : kpi.value}
                    </motion.div>
                    <div className={`text-xs font-medium flex items-center gap-1 ${
                      kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(kpi.change)}
                      {kpi.format === 'percentage' ? 'pp' : kpi.format === 'currency' ? '' : ''}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Monthly Revenue Performance
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                    <span className="text-gray-600">Actual Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-dashed border-green-500"></div>
                    <span className="text-gray-600">Target Revenue</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80 flex items-end gap-3 p-4">
                {data.revenue.monthly.slice(-6).map((month, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '280px' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.amount / 4000000) * 100}%` }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg absolute bottom-0 shadow-lg"
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                        className="absolute border-2 border-dashed border-green-500 w-full"
                        style={{ bottom: `${(month.target / 4000000) * 280}px` }}
                      />
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      className="text-center mt-3"
                    >
                      <div className="text-sm font-medium text-gray-900">{month.month}</div>
                      <div className="text-xs text-gray-600">{formatCurrency(month.amount)}</div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Department Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-green-600" />
                  Department Revenue Performance
                </h4>
                <div className="space-y-4">
                  {data.revenue.departments.map((dept, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {dept.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{formatCurrency(dept.revenue)}</span>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              dept.growth >= 8 ? 'bg-green-100 text-green-800' :
                              dept.growth >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            +{dept.growth}%
                          </motion.div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(dept.revenue / 16000000) * 100}%` }}
                          transition={{ delay: 1.4 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-600" />
                  Quality Metrics Dashboard
                </h4>
                <div className="space-y-4">
                  {data.quality.metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{metric.name}</span>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Current: {metric.current} | Target: {metric.target}
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`text-right ${
                            (metric.name.includes('Rate') || metric.name.includes('Errors')) ?
                            (metric.current <= metric.target ? 'text-green-600' : 'text-red-600') :
                            (metric.current >= metric.target ? 'text-green-600' : 'text-red-600')
                          }`}
                        >
                          <div className="text-lg font-bold">{metric.current}</div>
                          <div className="text-xs">
                            {((metric.current / metric.target) * 100).toFixed(0)}% of target
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Other tabs would follow similar enhanced patterns */}
        {activeTab !== 'overview' && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-8"
          >
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🚧
              </motion.div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} - Enhanced View
              </h4>
              <p className="text-gray-600 max-w-md mx-auto">
                Advanced analytics and visualizations for {activeTab} are being enhanced with interactive charts, 
                AI insights, and real-time data processing capabilities.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                  View Full {tabs.find(tab => tab.id === activeTab)?.label} Dashboard
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
