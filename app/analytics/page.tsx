'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days')
  const [loading, setLoading] = useState(false)

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$2,847,392',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Patients',
      value: '8,429',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Claims Processed',
      value: '12,847',
      change: '+15.3%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Collection Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const recentActivity = [
    { date: 'Jan 8, 2026', action: 'Revenue Report Generated', user: 'System', status: 'success' },
    { date: 'Jan 7, 2026', action: 'Claims Analysis Completed', user: 'Admin', status: 'success' },
    { date: 'Jan 7, 2026', action: 'Patient Data Import', user: 'Dr. Smith', status: 'success' },
    { date: 'Jan 6, 2026', action: 'Monthly Report Exported', user: 'Finance Team', status: 'success' },
    { date: 'Jan 6, 2026', action: 'Price Transparency Update', user: 'System', status: 'success' }
  ]

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time insights and performance metrics
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mt-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {metric.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Chart visualization coming soon</p>
                <p className="text-xs mt-1">Integrate Chart.js or Recharts</p>
              </div>
            </div>
          </div>

          {/* Patient Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Growth</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Chart visualization coming soon</p>
                <p className="text-xs mt-1">Integrate Chart.js or Recharts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {activity.action}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.user}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-2">Claims Approval Rate</h3>
            <p className="text-3xl font-bold">96.8%</p>
            <p className="text-sm opacity-80 mt-1">↑ 3.2% from last month</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-2">Average Payment Time</h3>
            <p className="text-3xl font-bold">18.5 days</p>
            <p className="text-sm opacity-80 mt-1">↓ 2.3 days improvement</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-2">Patient Satisfaction</h3>
            <p className="text-3xl font-bold">4.8/5.0</p>
            <p className="text-sm opacity-80 mt-1">Based on 2,847 reviews</p>
          </div>
        </div>
      </div>
    </div>
  )
}
