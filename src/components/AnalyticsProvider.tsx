"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AnalyticsContextType {
  realtimeMetrics: {
    activePatients: number;
    waitTime: number;
    bedOccupancy: number;
    staffUtilization: number;
    emergencyQueue: number;
  };
  performanceAlerts: Array<{
    id: string;
    type: 'warning' | 'critical' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    department?: string;
  }>;
  addAlert: (alert: Omit<AnalyticsContextType['performanceAlerts'][0], 'id' | 'timestamp'>) => void;
  refreshMetrics: () => void;
  isLoading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    activePatients: 0,
    waitTime: 0,
    bedOccupancy: 0,
    staffUtilization: 0,
    emergencyQueue: 0
  });

  const [performanceAlerts, setPerformanceAlerts] = useState<AnalyticsContextType['performanceAlerts']>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time metric updates
  useEffect(() => {
    const updateMetrics = () => {
      setRealtimeMetrics({
        activePatients: Math.floor(Math.random() * 50) + 150, // 150-200
        waitTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
        bedOccupancy: Math.floor(Math.random() * 20) + 75, // 75-95%
        staffUtilization: Math.floor(Math.random() * 15) + 80, // 80-95%
        emergencyQueue: Math.floor(Math.random() * 8) + 2, // 2-10
      });
    };

    // Initial load
    setTimeout(() => {
      updateMetrics();
      setIsLoading(false);
    }, 1000);

    // Update every 30 seconds
    const interval = setInterval(updateMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  // Generate performance alerts
  useEffect(() => {
    const checkAlerts = () => {
      const newAlerts: AnalyticsContextType['performanceAlerts'] = [];

      if (realtimeMetrics.waitTime > 35) {
        newAlerts.push({
          id: `alert-${Date.now()}-wait`,
          type: 'warning',
          title: 'Extended Wait Times',
          message: `Average wait time is ${realtimeMetrics.waitTime} minutes. Consider optimizing patient flow.`,
          timestamp: new Date(),
          department: 'Emergency'
        });
      }

      if (realtimeMetrics.bedOccupancy > 90) {
        newAlerts.push({
          id: `alert-${Date.now()}-beds`,
          type: 'critical',
          title: 'High Bed Occupancy',
          message: `Bed occupancy at ${realtimeMetrics.bedOccupancy}%. Plan for discharge coordination.`,
          timestamp: new Date(),
          department: 'Admissions'
        });
      }

      if (realtimeMetrics.emergencyQueue > 8) {
        newAlerts.push({
          id: `alert-${Date.now()}-emergency`,
          type: 'critical',
          title: 'Emergency Queue Backup',
          message: `${realtimeMetrics.emergencyQueue} patients in emergency queue. Immediate attention required.`,
          timestamp: new Date(),
          department: 'Emergency'
        });
      }

      if (realtimeMetrics.staffUtilization > 92) {
        newAlerts.push({
          id: `alert-${Date.now()}-staff`,
          type: 'warning',
          title: 'High Staff Utilization',
          message: `Staff utilization at ${realtimeMetrics.staffUtilization}%. Monitor for burnout risk.`,
          timestamp: new Date(),
          department: 'Human Resources'
        });
      }

      // Add new alerts and keep only last 10
      setPerformanceAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
    };

    if (!isLoading && realtimeMetrics.activePatients > 0) {
      checkAlerts();
    }
  }, [realtimeMetrics, isLoading]);

  const addAlert = (alert: Omit<AnalyticsContextType['performanceAlerts'][0], 'id' | 'timestamp'>) => {
    const newAlert: AnalyticsContextType['performanceAlerts'][0] = {
      ...alert,
      id: `alert-${Date.now()}-custom`,
      timestamp: new Date()
    };
    setPerformanceAlerts(prev => [newAlert, ...prev].slice(0, 10));
  };

  const refreshMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRealtimeMetrics({
        activePatients: Math.floor(Math.random() * 50) + 150,
        waitTime: Math.floor(Math.random() * 30) + 15,
        bedOccupancy: Math.floor(Math.random() * 20) + 75,
        staffUtilization: Math.floor(Math.random() * 15) + 80,
        emergencyQueue: Math.floor(Math.random() * 8) + 2,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        realtimeMetrics,
        performanceAlerts,
        addAlert,
        refreshMetrics,
        isLoading
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
