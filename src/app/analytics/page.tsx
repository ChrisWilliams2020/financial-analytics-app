"use client";

import { EnhancedHealthcareAnalytics } from "../../components/EnhancedHealthcareAnalytics";
import { EnhancedRealtimeDashboard } from "../../components/EnhancedRealtimeDashboard";
import { AnalyticsProvider } from "../../components/AnalyticsProvider";
import { useState } from "react";

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState<'realtime' | 'comprehensive'>('realtime');

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    <span className="text-blue-600">MedPact</span> Analytics Intelligence
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView('realtime')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeView === 'realtime'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    ⚡ Real-time Operations
                  </button>
                  <button
                    onClick={() => setActiveView('comprehensive')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeView === 'comprehensive'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    📊 Comprehensive Analytics
                  </button>
                </div>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {activeView === 'realtime' ? (
              <EnhancedRealtimeDashboard />
            ) : (
              <EnhancedHealthcareAnalytics />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500">
              <p>MedPact Healthcare Analytics Intelligence Platform</p>
              <p className="mt-1">© 2024 MedPact Enterprise Solutions. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsProvider>
  );
}
