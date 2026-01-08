"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  Table, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Settings,
  Share2,
  Mail,
  Printer,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Activity
} from "lucide-react";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: any;
  fileExtension: string;
  supportedData: string[];
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  dataTypes: string[];
  format: string;
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
}

interface ExportJob {
  id: string;
  templateId: string;
  templateName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  fileSize?: string;
  downloadUrl?: string;
  error?: string;
}

const exportFormats: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF Report',
    description: 'Formatted document with charts and tables',
    icon: FileText,
    fileExtension: 'pdf',
    supportedData: ['reports', 'analytics', 'charts']
  },
  {
    id: 'excel',
    name: 'Excel Spreadsheet',
    description: 'Detailed data tables with formulas',
    icon: Table,
    fileExtension: 'xlsx',
    supportedData: ['tables', 'raw-data', 'metrics']
  },
  {
    id: 'csv',
    name: 'CSV Data',
    description: 'Raw data for external analysis',
    icon: Table,
    fileExtension: 'csv',
    supportedData: ['tables', 'raw-data', 'patient-data']
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint Presentation',
    description: 'Executive summary with key visuals',
    icon: PieChart,
    fileExtension: 'pptx',
    supportedData: ['charts', 'analytics', 'summary']
  },
  {
    id: 'json',
    name: 'JSON Data',
    description: 'Structured data for API integration',
    icon: BarChart3,
    fileExtension: 'json',
    supportedData: ['raw-data', 'metrics', 'api-data']
  }
];

const exportTemplates: ExportTemplate[] = [
  {
    id: 'daily-operations',
    name: 'Daily Operations Summary',
    description: 'Key operational metrics and alerts from the last 24 hours',
    category: 'Operations',
    dataTypes: ['patient-flow', 'bed-occupancy', 'alerts', 'staff-metrics'],
    format: 'pdf',
    schedule: {
      frequency: 'daily',
      time: '08:00'
    }
  },
  {
    id: 'monthly-financial',
    name: 'Monthly Financial Report',
    description: 'Comprehensive revenue, cost, and profitability analysis',
    category: 'Financial',
    dataTypes: ['revenue', 'costs', 'denials', 'collections'],
    format: 'excel',
    schedule: {
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '09:00'
    }
  },
  {
    id: 'quality-metrics',
    name: 'Quality Metrics Dashboard',
    description: 'Patient safety, satisfaction, and clinical quality indicators',
    category: 'Quality',
    dataTypes: ['patient-satisfaction', 'safety-events', 'clinical-outcomes'],
    format: 'powerpoint'
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level KPIs and strategic insights for leadership',
    category: 'Executive',
    dataTypes: ['kpis', 'trends', 'strategic-metrics'],
    format: 'pdf'
  },
  {
    id: 'regulatory-compliance',
    name: 'Regulatory Compliance Report',
    description: 'Documentation for regulatory submissions and audits',
    category: 'Compliance',
    dataTypes: ['compliance-metrics', 'audit-data', 'policy-adherence'],
    format: 'pdf'
  },
  {
    id: 'patient-data-export',
    name: 'Patient Data Export',
    description: 'Anonymized patient data for research and analysis',
    category: 'Research',
    dataTypes: ['patient-demographics', 'clinical-data', 'outcomes'],
    format: 'csv'
  }
];

export function DataExportSystem() {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customExport, setCustomExport] = useState({
    name: '',
    description: '',
    dataTypes: [] as string[],
    dateRange: {
      start: '',
      end: ''
    },
    filters: {} as any
  });
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [activeTab, setActiveTab] = useState<'quick' | 'templates' | 'custom' | 'scheduled'>('quick');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock export jobs
  useEffect(() => {
    const mockJobs: ExportJob[] = [
      {
        id: '1',
        templateId: 'daily-operations',
        templateName: 'Daily Operations Summary',
        status: 'completed',
        progress: 100,
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() - 3300000),
        fileSize: '2.4 MB',
        downloadUrl: '#'
      },
      {
        id: '2',
        templateId: 'monthly-financial',
        templateName: 'Monthly Financial Report',
        status: 'running',
        progress: 65,
        startTime: new Date(Date.now() - 900000)
      },
      {
        id: '3',
        templateId: 'quality-metrics',
        templateName: 'Quality Metrics Dashboard',
        status: 'failed',
        progress: 0,
        startTime: new Date(Date.now() - 1800000),
        error: 'Insufficient permissions to access quality data'
      }
    ];

    setExportJobs(mockJobs);

    // Simulate job progress
    const interval = setInterval(() => {
      setExportJobs(prev => prev.map(job => {
        if (job.status === 'running' && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 10, 100);
          if (newProgress >= 100) {
            return {
              ...job,
              status: 'completed',
              progress: 100,
              endTime: new Date(),
              fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
              downloadUrl: '#'
            };
          }
          return { ...job, progress: newProgress };
        }
        return job;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickExport = (format: string, dataType: string) => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      templateId: 'quick-export',
      templateName: `Quick Export - ${dataType}`,
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);
  };

  const handleTemplateExport = (templateId: string) => {
    const template = exportTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newJob: ExportJob = {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'running': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const duration = endTime.getTime() - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const renderQuickExport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Export</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-1 gap-3">
              {exportFormats.map((format) => (
                <motion.button
                  key={format.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-colors text-left ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <format.icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{format.name}</div>
                    <div className="text-sm text-gray-600">{format.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Data Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Data to Export</label>
            <div className="space-y-3">
              {[
                { id: 'dashboard-overview', name: 'Dashboard Overview', icon: BarChart3 },
                { id: 'financial-summary', name: 'Financial Summary', icon: DollarSign },
                { id: 'patient-metrics', name: 'Patient Metrics', icon: Users },
                { id: 'operational-data', name: 'Operational Data', icon: Activity },
                { id: 'quality-indicators', name: 'Quality Indicators', icon: TrendingUp }
              ].map((dataType) => (
                <motion.button
                  key={dataType.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickExport(selectedFormat, dataType.name)}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <dataType.icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{dataType.name}</span>
                  <Download className="w-4 h-4 text-gray-400 ml-auto" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Templates</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {exportTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -2 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {template.format.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {template.dataTypes.slice(0, 3).map((type) => (
                  <span key={type} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {type.replace('-', ' ')}
                  </span>
                ))}
                {template.dataTypes.length > 3 && (
                  <span className="text-xs text-gray-600">
                    +{template.dataTypes.length - 3} more
                  </span>
                )}
              </div>

              {template.schedule && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Scheduled {template.schedule.frequency}
                    {template.schedule.time && ` at ${template.schedule.time}`}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTemplateExport(template.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear History
        </motion.button>
      </div>

      <div className="space-y-3">
        {exportJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${getStatusColor(job.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{job.templateName}</h4>
                  <div className="text-sm text-gray-600">
                    Started {job.startTime.toLocaleTimeString()}
                    {job.endTime && ` • Duration: ${formatDuration(job.startTime, job.endTime)}`}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {job.fileSize && (
                  <span className="text-sm text-gray-600">{job.fileSize}</span>
                )}
                {job.status === 'completed' && job.downloadUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </motion.button>
                )}
              </div>
            </div>

            {job.status === 'running' && (
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(job.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>
              </div>
            )}

            {job.error && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                <strong>Error:</strong> {job.error}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Export</h2>
            <p className="text-sm text-gray-600 mt-1">
              Export reports, analytics, and data in various formats
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'quick', label: 'Quick Export' },
            { key: 'templates', label: 'Templates' },
            { key: 'custom', label: 'Custom' },
            { key: 'scheduled', label: 'Scheduled' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'quick' && renderQuickExport()}
                {activeTab === 'templates' && renderTemplates()}
                {activeTab === 'custom' && <div>Custom export builder (coming soon)</div>}
                {activeTab === 'scheduled' && <div>Scheduled exports (coming soon)</div>}
              </motion.div>
            </div>

            {/* Export History Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-fit">
                {renderJobHistory()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
