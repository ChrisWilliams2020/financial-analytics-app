"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Settings, 
  Download, 
  Menu,
  X,
  ChevronDown,
  Plus,
  Filter,
  Star,
  Share2,
  MoreHorizontal
} from "lucide-react";
import { AdvancedSearchInterface, SearchProvider } from "./AdvancedSearchSystem";
import { NotificationCenter, NotificationProvider } from "./NotificationSystem";
import { UserPreferencesPanel, PreferencesProvider } from "./UserPreferencesPanel";
import { DataExportSystem } from "./DataExportSystem";

interface PlatformFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  component: any;
  badge?: string;
  shortcut?: string;
}

const platformFeatures: PlatformFeature[] = [
  {
    id: 'search',
    name: 'Advanced Search',
    description: 'Intelligent search across all data',
    icon: Search,
    component: AdvancedSearchInterface,
    shortcut: '⌘K'
  },
  {
    id: 'notifications',
    name: 'Notification Center',
    description: 'Real-time alerts and updates',
    icon: Bell,
    component: NotificationCenter,
    badge: 'New'
  },
  {
    id: 'preferences',
    name: 'User Preferences',
    description: 'Customize your experience',
    icon: Settings,
    component: UserPreferencesPanel
  },
  {
    id: 'export',
    name: 'Data Export',
    description: 'Export reports and analytics',
    icon: Download,
    component: DataExportSystem
  }
];

export function AdvancedPlatformFeatures() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showFeaturePanel, setShowFeaturePanel] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const renderFeatureComponent = (featureId: string) => {
    const feature = platformFeatures.find(f => f.id === featureId);
    if (!feature?.component) return null;

    const Component = feature.component;
    
    if (featureId === 'preferences') {
      return (
        <div className="h-96 overflow-hidden">
          <Component />
        </div>
      );
    }
    
    if (featureId === 'export') {
      return (
        <div className="h-96 overflow-hidden">
          <Component />
        </div>
      );
    }

    return <Component />;
  };

  return (
    <SearchProvider>
      <NotificationProvider>
        <PreferencesProvider>
          <div className="relative">
            {/* Feature Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                {/* Left: Search */}
                <div className="flex-1 max-w-md">
                  <AdvancedSearchInterface />
                </div>

                {/* Center: Quick Actions */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuickActionOpen(!quickActionOpen)}
                    className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Quick Actions
                    <ChevronDown className={`w-4 h-4 transition-transform ${quickActionOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Quick Actions Dropdown */}
                  <AnimatePresence>
                    {quickActionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                      >
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                          <div className="space-y-2">
                            {[
                              { name: 'Export Dashboard', icon: Download, action: () => setActiveFeature('export') },
                              { name: 'Create Alert', icon: Bell, action: () => {} },
                              { name: 'Share Report', icon: Share2, action: () => {} },
                              { name: 'Add Filter', icon: Filter, action: () => {} },
                              { name: 'Save View', icon: Star, action: () => {} }
                            ].map((item, index) => (
                              <motion.button
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 5 }}
                                onClick={() => {
                                  item.action();
                                  setQuickActionOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <item.icon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-700">{item.name}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: Feature Icons */}
                <div className="flex items-center gap-2">
                  <NotificationCenter />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveFeature('preferences');
                      setShowFeaturePanel(true);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveFeature('export');
                      setShowFeaturePanel(true);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFeaturePanel(!showFeaturePanel)}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Feature Panel Overlay */}
            <AnimatePresence>
              {showFeaturePanel && activeFeature && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFeaturePanel(false)}
                    className="fixed inset-0 bg-black bg-opacity-25 z-40"
                  />

                  {/* Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        {platformFeatures.find(f => f.id === activeFeature)?.icon && (
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {(() => {
                              const IconComponent = platformFeatures.find(f => f.id === activeFeature)?.icon;
                              return IconComponent ? <IconComponent className="w-5 h-5 text-blue-600" /> : null;
                            })()}
                          </div>
                        )}
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {platformFeatures.find(f => f.id === activeFeature)?.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {platformFeatures.find(f => f.id === activeFeature)?.description}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFeaturePanel(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-auto">
                      {renderFeatureComponent(activeFeature)}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Click outside to close quick actions */}
            {quickActionOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setQuickActionOpen(false)}
              />
            )}
          </div>
        </PreferencesProvider>
      </NotificationProvider>
    </SearchProvider>
  );
}

// Feature Status Indicator
export function FeatureStatusIndicator() {
  const features = [
    { name: 'Search', status: 'active', usage: 89 },
    { name: 'Notifications', status: 'active', usage: 76 },
    { name: 'Export', status: 'active', usage: 45 },
    { name: 'Preferences', status: 'active', usage: 34 }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-3">Platform Features</h3>
      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                feature.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className="text-sm text-gray-700">{feature.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${feature.usage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8">{feature.usage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvancedPlatformFeatures;
