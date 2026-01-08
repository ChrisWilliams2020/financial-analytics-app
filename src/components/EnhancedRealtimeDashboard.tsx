"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Bed, 
  UserCheck, 
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useAnalytics } from "./AnalyticsProvider";
import { useState, useEffect } from "react";

export function EnhancedRealtimeDashboard() {
  const { realtimeMetrics, performanceAlerts, refreshMetrics, isLoading } = useAnalytics();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshMetrics();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }, reverse = false) => {
    if (reverse) {
      if (value <= thresholds.critical) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' };
      if (value <= thresholds.warning) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500' };
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' };
    } else {
      if (value >= thresholds.critical) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' };
      if (value >= thresholds.warning) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500' };
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' };
    }
  };

  const metricConfigs = [
    {
      key: 'activePatients',
      label: 'Active Patients',
      icon: Users,
      value: realtimeMetrics.activePatients,
      suffix: '',
      description: 'Hospital-wide census',
      thresholds: { warning: 180, critical: 190 }
    },
    {
      key: 'waitTime',
      label: 'Avg Wait Time',
      icon: Clock,
      value: realtimeMetrics.waitTime,
      suffix: 'min',
      description: 'Emergency & Outpatient',
      thresholds: { warning: 30, critical: 40 }
    },
    {
      key: 'bedOccupancy',
      label: 'Bed Occupancy',
      icon: Bed,
      value: realtimeMetrics.bedOccupancy,
      suffix: '%',
      description: 'All units combined',
      thresholds: { warning: 85, critical: 90 }
    },
    {
      key: 'staffUtilization',
      label: 'Staff Utilization',
      icon: UserCheck,
      value: realtimeMetrics.staffUtilization,
      suffix: '%',
      description: 'Current shift capacity',
      thresholds: { warning: 90, critical: 95 }
    },
    {
      key: 'emergencyQueue',
      label: 'Emergency Queue',
      icon: AlertTriangle,
      value: realtimeMetrics.emergencyQueue,
      suffix: '',
      description: 'Patients waiting',
      thresholds: { warning: 6, critical: 8 }
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
              >
                ⚡
              </motion.div>
              Real-time Hospital Operations
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 mt-2"
            >
              Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refresh: 30s
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 1, ease: "linear", repeat: refreshing ? Infinity : 0 }}
            >
              <RefreshCw size={18} />
            </motion.div>
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricConfigs.map((metric, index) => {
          const colors = getStatusColor(metric.value, metric.thresholds);
          const IconComponent = metric.icon;
          
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/50 ${colors.icon}`}>
                  <IconComponent size={24} />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  className={`w-3 h-3 rounded-full ${
                    metric.value >= metric.thresholds.critical ? 'bg-red-400' :
                    metric.value >= metric.thresholds.warning ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                />
              </div>
              
              <div className="space-y-2">
                <div className={`text-sm font-semibold ${colors.text}`}>
                  {metric.label}
                </div>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {metric.value}
                  <span className="text-lg text-gray-600">{metric.suffix}</span>
                </motion.div>
                <div className="text-xs text-gray-600">
                  {metric.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Performance Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: performanceAlerts.length > 0 ? [1, 1.2, 1] : 1,
                rotate: performanceAlerts.length > 0 ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 2, repeat: performanceAlerts.length > 0 ? Infinity : 0 }}
            >
              🚨
            </motion.div>
            Active Performance Alerts
          </h4>
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
          >
            {performanceAlerts.length} active alert{performanceAlerts.length !== 1 ? 's' : ''}
          </motion.span>
        </div>

        <AnimatePresence mode="popLayout">
          {performanceAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                ✅
              </motion.div>
              <div className="text-xl font-semibold text-gray-700">All systems operating normally</div>
              <div className="text-gray-500 mt-2">No performance alerts at this time</div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {performanceAlerts.map((alert, index) => {
                const alertIcon = alert.type === 'critical' ? AlertCircle : 
                                alert.type === 'warning' ? AlertTriangle : Info;
                const AlertIcon = alertIcon;
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className={`p-5 rounded-xl border-l-4 ${
                      alert.type === 'critical'
                        ? 'bg-red-50 border-red-400 hover:bg-red-100'
                        : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100'
                        : 'bg-blue-50 border-blue-400 hover:bg-blue-100'
                    } transition-all duration-200 cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <motion.div
                          animate={{ 
                            scale: alert.type === 'critical' ? [1, 1.2, 1] : 1,
                            rotate: alert.type === 'critical' ? [0, 5, -5, 0] : 0
                          }}
                          transition={{ duration: 1.5, repeat: alert.type === 'critical' ? Infinity : 0 }}
                          className={`p-2 rounded-lg ${
                            alert.type === 'critical' ? 'bg-red-200 text-red-700' :
                            alert.type === 'warning' ? 'bg-yellow-200 text-yellow-700' :
                            'bg-blue-200 text-blue-700'
                          }`}
                        >
                          <AlertIcon size={20} />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`font-semibold ${
                              alert.type === 'critical' ? 'text-red-800' :
                              alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                            }`}>
                              {alert.title}
                            </span>
                            {alert.department && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-3 py-1 bg-white shadow-sm text-gray-700 text-xs rounded-full font-medium"
                              >
                                {alert.department}
                              </motion.span>
                            )}
                          </div>
                          <div className={`text-sm ${
                            alert.type === 'critical' ? 'text-red-700' :
                            alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                          }`}>
                            {alert.message}
                          </div>
                        </div>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-500 font-medium"
                      >
                        {alert.timestamp.toLocaleTimeString()}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⚡
          </motion.div>
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📋', title: 'Patient Flow', desc: 'Manage admissions', color: 'hover:bg-blue-50 hover:border-blue-200' },
            { icon: '👨‍⚕️', title: 'Staff Schedule', desc: 'Adjust staffing', color: 'hover:bg-green-50 hover:border-green-200' },
            { icon: '🛏️', title: 'Bed Management', desc: 'Room assignments', color: 'hover:bg-purple-50 hover:border-purple-200' },
            { icon: '📊', title: 'Reports', desc: 'Generate insights', color: 'hover:bg-orange-50 hover:border-orange-200' }
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 text-left border-2 border-gray-100 rounded-xl transition-all duration-200 ${action.color} group`}
            >
              <motion.div 
                className="text-2xl mb-3"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {action.icon}
              </motion.div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-gray-800">
                {action.title}
              </div>
              <div className="text-xs text-gray-600 mt-1 group-hover:text-gray-700">
                {action.desc}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Enhanced System Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            🔧
          </motion.div>
          System Health
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'EHR System', status: 'Operating normally', time: '30s ago', health: 'good' },
            { name: 'Lab Systems', status: 'All interfaces active', time: '15s ago', health: 'good' },
            { name: 'Imaging Network', status: 'Minor latency detected', time: '2.3s avg', health: 'warning' }
          ].map((system, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                system.health === 'good' 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-4 h-4 rounded-full ${
                    system.health === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className={`font-semibold ${
                  system.health === 'good' ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {system.name}
                </span>
              </div>
              <div className={`text-sm mb-2 ${
                system.health === 'good' ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {system.status}
              </div>
              <div className={`text-xs ${
                system.health === 'good' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                Last check: {system.time}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
