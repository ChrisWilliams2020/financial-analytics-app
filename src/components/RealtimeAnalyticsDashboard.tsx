"use client";

import { useAnalytics } from "./AnalyticsProvider";
import { useState, useEffect } from "react";

export function RealtimeAnalyticsDashboard() {
  const { realtimeMetrics, performanceAlerts, refreshMetrics, isLoading } = useAnalytics();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }, reverse = false) => {
    if (reverse) {
      if (value <= thresholds.critical) return 'text-red-600 bg-red-50';
      if (value <= thresholds.warning) return 'text-yellow-600 bg-yellow-50';
      return 'text-green-600 bg-green-50';
    } else {
      if (value >= thresholds.critical) return 'text-red-600 bg-red-50';
      if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-50';
      return 'text-green-600 bg-green-50';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">⚡ Real-time Hospital Operations</h3>
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refresh: 30s
            </p>
          </div>
          <button
            onClick={refreshMetrics}
            className="btn btn-primary text-sm flex items-center gap-2"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(realtimeMetrics.activePatients, { warning: 180, critical: 190 })}`}>
            <div className="text-sm font-medium mb-1">👥 Active Patients</div>
            <div className="text-2xl font-bold">{realtimeMetrics.activePatients}</div>
            <div className="text-xs opacity-75">Hospital-wide census</div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(realtimeMetrics.waitTime, { warning: 30, critical: 40 })}`}>
            <div className="text-sm font-medium mb-1">⏱️ Avg Wait Time</div>
            <div className="text-2xl font-bold">{realtimeMetrics.waitTime}<span className="text-sm">min</span></div>
            <div className="text-xs opacity-75">Emergency & Outpatient</div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(realtimeMetrics.bedOccupancy, { warning: 85, critical: 90 })}`}>
            <div className="text-sm font-medium mb-1">🛏️ Bed Occupancy</div>
            <div className="text-2xl font-bold">{realtimeMetrics.bedOccupancy}<span className="text-sm">%</span></div>
            <div className="text-xs opacity-75">All units combined</div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(realtimeMetrics.staffUtilization, { warning: 90, critical: 95 })}`}>
            <div className="text-sm font-medium mb-1">👨‍⚕️ Staff Utilization</div>
            <div className="text-2xl font-bold">{realtimeMetrics.staffUtilization}<span className="text-sm">%</span></div>
            <div className="text-xs opacity-75">Current shift capacity</div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getStatusColor(realtimeMetrics.emergencyQueue, { warning: 6, critical: 8 })}`}>
            <div className="text-sm font-medium mb-1">🚨 Emergency Queue</div>
            <div className="text-2xl font-bold">{realtimeMetrics.emergencyQueue}</div>
            <div className="text-xs opacity-75">Patients waiting</div>
          </div>
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">🚨 Active Performance Alerts</h4>
          <span className="text-sm text-gray-600">
            {performanceAlerts.length} active alert{performanceAlerts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {performanceAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-gray-600">All systems operating normally</div>
            <div className="text-sm text-gray-500 mt-1">No performance alerts at this time</div>
          </div>
        ) : (
          <div className="space-y-3">
            {performanceAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'critical'
                    ? 'bg-red-50 border-red-400'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${
                        alert.type === 'critical' ? 'text-red-800' :
                        alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                      }`}>
                        {alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'} {alert.title}
                      </span>
                      {alert.department && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {alert.department}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm ${
                      alert.type === 'critical' ? 'text-red-700' :
                      alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {alert.message}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold text-gray-900 mb-4">⚡ Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-lg mb-1">📋</div>
            <div className="text-sm font-medium">Patient Flow</div>
            <div className="text-xs text-gray-600">Manage admissions</div>
          </button>
          <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-lg mb-1">👨‍⚕️</div>
            <div className="text-sm font-medium">Staff Schedule</div>
            <div className="text-xs text-gray-600">Adjust staffing</div>
          </button>
          <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-lg mb-1">🛏️</div>
            <div className="text-sm font-medium">Bed Management</div>
            <div className="text-xs text-gray-600">Room assignments</div>
          </button>
          <button className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-lg mb-1">📊</div>
            <div className="text-sm font-medium">Reports</div>
            <div className="text-xs text-gray-600">Generate insights</div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold text-gray-900 mb-4">🔧 System Health</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">EHR System</span>
            </div>
            <div className="text-sm text-green-700">Operating normally</div>
            <div className="text-xs text-green-600 mt-1">Last check: 30s ago</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Lab Systems</span>
            </div>
            <div className="text-sm text-green-700">All interfaces active</div>
            <div className="text-xs text-green-600 mt-1">Last sync: 15s ago</div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800">Imaging Network</span>
            </div>
            <div className="text-sm text-yellow-700">Minor latency detected</div>
            <div className="text-xs text-yellow-600 mt-1">Response: 2.3s avg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
