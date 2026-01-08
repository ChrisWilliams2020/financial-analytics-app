"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  Settings,
  Filter,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageCircle
} from "lucide-react";

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  category: string;
  read: boolean;
  starred: boolean;
  actionRequired: boolean;
  metadata?: {
    patientId?: string;
    departmentId?: string;
    reportId?: string;
    value?: number;
    threshold?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;
  starNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'starred'>) => void;
  filterNotifications: (filters: NotificationFilters) => Notification[];
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

interface NotificationFilters {
  type?: string[];
  priority?: string[];
  category?: string[];
  read?: boolean;
  starred?: boolean;
  actionRequired?: boolean;
  dateRange?: string;
}

interface NotificationSettings {
  soundEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  priorityFilters: {
    critical: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  categoryFilters: string[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    soundEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    priorityFilters: {
      critical: true,
      high: true,
      medium: true,
      low: false
    },
    categoryFilters: ['Operations', 'Financial', 'Quality', 'Clinical']
  });

  // Mock initial notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'alert',
        priority: 'critical',
        title: 'ICU Bed Capacity Critical',
        message: 'ICU bed occupancy at 98%. Immediate action required to manage patient flow.',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        category: 'Operations',
        read: false,
        starred: false,
        actionRequired: true,
        metadata: {
          departmentId: 'ICU-01',
          value: 98,
          threshold: 95
        }
      },
      {
        id: '2',
        type: 'warning',
        priority: 'high',
        title: 'Revenue Cycle Alert',
        message: 'Claims denial rate increased by 15% this week. Review needed.',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        category: 'Financial',
        read: false,
        starred: true,
        actionRequired: true,
        metadata: {
          value: 15,
          threshold: 10
        }
      },
      {
        id: '3',
        type: 'success',
        priority: 'medium',
        title: 'Protocol Optimization Complete',
        message: 'Cardiac catheterization protocol optimization resulted in 22% cost reduction.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        category: 'Clinical',
        read: false,
        starred: false,
        actionRequired: false,
        metadata: {
          value: 22
        }
      },
      {
        id: '4',
        type: 'info',
        priority: 'medium',
        title: 'Monthly Analytics Report Ready',
        message: 'December 2024 performance analytics report has been generated and is ready for review.',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        category: 'Analytics',
        read: true,
        starred: false,
        actionRequired: false,
        metadata: {
          reportId: 'RPT-2024-12'
        }
      },
      {
        id: '5',
        type: 'warning',
        priority: 'high',
        title: 'Patient Safety Alert',
        message: 'Medication error rate above threshold in cardiac unit. Quality review initiated.',
        timestamp: new Date(Date.now() - 14400000), // 4 hours ago
        category: 'Quality',
        read: true,
        starred: true,
        actionRequired: true,
        metadata: {
          departmentId: 'CARD-01',
          value: 0.8,
          threshold: 0.5
        }
      },
      {
        id: '6',
        type: 'info',
        priority: 'low',
        title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance window: January 15, 2025, 2:00 AM - 4:00 AM EST.',
        timestamp: new Date(Date.now() - 86400000), // 24 hours ago
        category: 'System',
        read: false,
        starred: false,
        actionRequired: false
      }
    ];

    setNotifications(mockNotifications);

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('medpact-notification-settings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'info' as const,
          priority: 'medium' as const,
          title: 'New Patient Admission',
          message: 'Emergency patient admitted to ICU. Cardiac monitoring initiated.',
          category: 'Operations',
          actionRequired: false
        },
        {
          type: 'alert' as const,
          priority: 'high' as const,
          title: 'Equipment Maintenance Due',
          message: 'MRI Machine #2 requires scheduled maintenance within 24 hours.',
          category: 'Operations',
          actionRequired: true
        },
        {
          type: 'success' as const,
          priority: 'low' as const,
          title: 'Cost Savings Achieved',
          message: 'Supply chain optimization saved $15,000 this month.',
          category: 'Financial',
          actionRequired: false
        }
      ];

      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const archiveNotification = (id: string) => {
    // In a real app, this would move to an archived list
    deleteNotification(id);
  };

  const starNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'starred'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      starred: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound if enabled
    if (notificationSettings.soundEnabled) {
      // In production, implement actual notification sound
      // For demo purposes, skip sound playback
    }
  };

  const filterNotifications = (filters: NotificationFilters): Notification[] => {
    return notifications.filter(notification => {
      if (filters.type && !filters.type.includes(notification.type)) return false;
      if (filters.priority && !filters.priority.includes(notification.priority)) return false;
      if (filters.category && !filters.category.includes(notification.category)) return false;
      if (filters.read !== undefined && notification.read !== filters.read) return false;
      if (filters.starred !== undefined && notification.starred !== filters.starred) return false;
      if (filters.actionRequired !== undefined && notification.actionRequired !== filters.actionRequired) return false;
      return true;
    });
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    const newSettings = { ...notificationSettings, ...settings };
    setNotificationSettings(newSettings);
    localStorage.setItem('medpact-notification-settings', JSON.stringify(newSettings));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        archiveNotification,
        starNotification,
        addNotification,
        filterNotifications,
        notificationSettings,
        updateNotificationSettings
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    starNotification,
    filterNotifications,
    notificationSettings,
    updateNotificationSettings
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'starred' | 'action'>('all');

  const getFilteredNotifications = () => {
    let baseFilters = { ...filters };
    
    switch (selectedTab) {
      case 'unread':
        baseFilters.read = false;
        break;
      case 'starred':
        baseFilters.starred = true;
        break;
      case 'action':
        baseFilters.actionRequired = true;
        break;
    }

    return filterNotifications(baseFilters);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'critical') return 'text-red-600 bg-red-50 border-red-200';
    
    switch (type) {
      case 'alert': return 'text-red-600 bg-red-50 border-red-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'all', label: 'All', count: notifications.length },
                    { key: 'unread', label: 'Unread', count: unreadCount },
                    { key: 'starred', label: 'Starred', count: notifications.filter(n => n.starred).length },
                    { key: 'action', label: 'Action', count: notifications.filter(n => n.actionRequired).length }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedTab(tab.key as any)}
                      className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        selectedTab === tab.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={markAllAsRead}
                    className="mt-3 w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </motion.button>
                )}
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      <h4 className="font-medium text-gray-900">Notification Settings</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Sound notifications</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.soundEnabled}
                            onChange={(e) => updateNotificationSettings({ soundEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Email notifications</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailEnabled}
                            onChange={(e) => updateNotificationSettings({ emailEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Push notifications</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushEnabled}
                            onChange={(e) => updateNotificationSettings({ pushEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-96">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type, notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h5>
                              {getPriorityBadge(notification.priority)}
                              {notification.actionRequired && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  Action Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{notification.category}</span>
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => starNotification(notification.id)}
                                  className={`p-1 rounded ${
                                    notification.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                                  }`}
                                >
                                  <Star className="w-3 h-3" fill={notification.starred ? 'currentColor' : 'none'} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => archiveNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                  <Archive className="w-3 h-3" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="w-2 h-2 bg-blue-500 rounded-full mt-2"
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-2">🔔</div>
                    <p className="text-gray-600">No notifications found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedTab !== 'all' ? `No ${selectedTab} notifications` : 'You\'re all caught up!'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
