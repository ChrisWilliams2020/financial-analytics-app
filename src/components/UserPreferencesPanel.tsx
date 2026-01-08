"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  User, 
  Bell, 
  Eye, 
  Palette, 
  Globe, 
  Shield, 
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface UserPreferences {
  profile: {
    name: string;
    email: string;
    role: string;
    department: string;
    avatar?: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    colorScheme: 'blue' | 'green' | 'purple' | 'orange';
    fontSize: 'small' | 'medium' | 'large';
    sidebarCollapsed: boolean;
    animations: boolean;
    compactMode: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
    sound: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    categories: {
      alerts: boolean;
      reports: boolean;
      system: boolean;
      updates: boolean;
    };
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    crashReports: boolean;
    marketing: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number; // in minutes
  };
  dashboard: {
    defaultView: 'overview' | 'analytics' | 'reports' | 'patients';
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
    showTooltips: boolean;
    chartAnimations: boolean;
    gridDensity: 'comfortable' | 'compact' | 'spacious';
  };
  accessibility: {
    screenReader: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
  };
}

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (section: keyof UserPreferences, updates: any) => void;
  resetPreferences: () => void;
  exportPreferences: () => void;
  importPreferences: (data: UserPreferences) => void;
  isDirty: boolean;
  savePreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

interface PreferencesProviderProps {
  children: ReactNode;
}

const defaultPreferences: UserPreferences = {
  profile: {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medpact.com',
    role: 'Chief Medical Officer',
    department: 'Administration'
  },
  appearance: {
    theme: 'light',
    colorScheme: 'blue',
    fontSize: 'medium',
    sidebarCollapsed: false,
    animations: true,
    compactMode: false
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    desktop: true,
    sound: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    categories: {
      alerts: true,
      reports: true,
      system: true,
      updates: false
    }
  },
  privacy: {
    dataSharing: false,
    analytics: true,
    crashReports: true,
    marketing: false,
    twoFactorAuth: true,
    sessionTimeout: 60
  },
  dashboard: {
    defaultView: 'overview',
    autoRefresh: true,
    refreshInterval: 30,
    showTooltips: true,
    chartAnimations: true,
    gridDensity: 'comfortable'
  },
  accessibility: {
    screenReader: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    keyboardNavigation: true,
    focusIndicators: true
  }
};

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('medpact-user-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        // Handle parsing error silently in production
        // Could implement proper error reporting here
      }
    }
  }, []);

  const updatePreferences = (section: keyof UserPreferences, updates: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
    setIsDirty(true);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setIsDirty(true);
  };

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medpact-preferences.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importPreferences = (data: UserPreferences) => {
    setPreferences(data);
    setIsDirty(true);
  };

  const savePreferences = async () => {
    try {
      localStorage.setItem('medpact-user-preferences', JSON.stringify(preferences));
      setIsDirty(false);
      // In a real app, also save to server
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      // Handle save error gracefully in production
      throw error;
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        exportPreferences,
        importPreferences,
        isDirty,
        savePreferences
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function UserPreferencesPanel() {
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    isDirty,
    savePreferences
  } = usePreferences();

  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePreferences();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' }
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={preferences.profile.name}
              onChange={(e) => updatePreferences('profile', { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={preferences.profile.email}
              onChange={(e) => updatePreferences('profile', { email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={preferences.profile.role}
              onChange={(e) => updatePreferences('profile', { role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Chief Medical Officer">Chief Medical Officer</option>
              <option value="Administrator">Administrator</option>
              <option value="Physician">Physician</option>
              <option value="Nurse">Nurse</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={preferences.profile.department}
              onChange={(e) => updatePreferences('profile', { department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Administration">Administration</option>
              <option value="Emergency">Emergency</option>
              <option value="ICU">ICU</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Finance">Finance</option>
              <option value="Quality">Quality</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex gap-3">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor }
              ].map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updatePreferences('appearance', { theme: theme.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    preferences.appearance.theme === theme.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <theme.icon className="w-4 h-4" />
                  {theme.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
            <div className="flex gap-3">
              {colorSchemes.map((scheme) => (
                <motion.button
                  key={scheme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updatePreferences('appearance', { colorScheme: scheme.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    preferences.appearance.colorScheme === scheme.id
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                  {scheme.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={preferences.appearance.fontSize}
              onChange={(e) => updatePreferences('appearance', { fontSize: e.target.value })}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable animations</span>
              <input
                type="checkbox"
                checked={preferences.appearance.animations}
                onChange={(e) => updatePreferences('appearance', { animations: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Compact mode</span>
              <input
                type="checkbox"
                checked={preferences.appearance.compactMode}
                onChange={(e) => updatePreferences('appearance', { compactMode: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Collapse sidebar by default</span>
              <input
                type="checkbox"
                checked={preferences.appearance.sidebarCollapsed}
                onChange={(e) => updatePreferences('appearance', { sidebarCollapsed: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => updatePreferences('notifications', { email: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) => updatePreferences('notifications', { push: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">SMS notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.sms}
                  onChange={(e) => updatePreferences('notifications', { sms: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Desktop notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.desktop}
                  onChange={(e) => updatePreferences('notifications', { desktop: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sound alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.sound}
                  onChange={(e) => updatePreferences('notifications', { sound: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Critical alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.categories.alerts}
                  onChange={(e) => updatePreferences('notifications', { 
                    categories: { ...preferences.notifications.categories, alerts: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Report notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.categories.reports}
                  onChange={(e) => updatePreferences('notifications', { 
                    categories: { ...preferences.notifications.categories, reports: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">System updates</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.categories.system}
                  onChange={(e) => updatePreferences('notifications', { 
                    categories: { ...preferences.notifications.categories, system: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Feature updates</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.categories.updates}
                  onChange={(e) => updatePreferences('notifications', { 
                    categories: { ...preferences.notifications.categories, updates: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Quiet Hours</h4>
            <label className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">Enable quiet hours</span>
              <input
                type="checkbox"
                checked={preferences.notifications.quietHours.enabled}
                onChange={(e) => updatePreferences('notifications', { 
                  quietHours: { ...preferences.notifications.quietHours, enabled: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            {preferences.notifications.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Start time</label>
                  <input
                    type="time"
                    value={preferences.notifications.quietHours.start}
                    onChange={(e) => updatePreferences('notifications', { 
                      quietHours: { ...preferences.notifications.quietHours, start: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">End time</label>
                  <input
                    type="time"
                    value={preferences.notifications.quietHours.end}
                    onChange={(e) => updatePreferences('notifications', { 
                      quietHours: { ...preferences.notifications.quietHours, end: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Export Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Export your preferences and settings to a JSON file for backup or transfer.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportPreferences}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Preferences
            </motion.button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Import Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Import preferences from a previously exported JSON file.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import Preferences
            </motion.button>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-medium text-red-900 mb-3">Reset All Settings</h4>
            <p className="text-sm text-red-700 mb-4">
              Reset all preferences to their default values. This action cannot be undone.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPreferences}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'appearance': return renderAppearanceSection();
      case 'notifications': return renderNotificationsSection();
      case 'data': return renderDataSection();
      default: return <div>Section not implemented yet</div>;
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Preferences</h2>
          <nav className="space-y-1">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 2 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Save Status */}
        <div className="p-4 border-t border-gray-200">
          <AnimatePresence>
            {isDirty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-3"
              >
                <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  Unsaved changes
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDirty
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
            ) : saveStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
