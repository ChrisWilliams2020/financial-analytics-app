'use client';

import { useState } from 'react';
import { Upload, FileText, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function ProviderNegotiation() {
  const [activeStage, setActiveStage] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);

  const negotiationStages = [
    {
      id: 1,
      title: 'Initial Proposal',
      description: 'Submit initial contract terms and pricing proposals',
      status: 'completed',
      icon: FileText,
      requirements: ['Provider credentials', 'Initial pricing matrix', 'Service catalog'],
      timeline: '3-5 days'
    },
    {
      id: 2,
      title: 'Data Review',
      description: 'Payer reviews provider performance and quality metrics',
      status: 'active',
      icon: TrendingUp,
      requirements: ['Quality scores', 'Utilization data', 'Patient outcomes'],
      timeline: '7-10 days'
    },
    {
      id: 3,
      title: 'Counter Negotiation',
      description: 'Exchange of revised terms and pricing adjustments',
      status: 'pending',
      icon: DollarSign,
      requirements: ['Revised pricing', 'Risk sharing models', 'Performance incentives'],
      timeline: '5-7 days'
    },
    {
      id: 4,
      title: 'Final Review',
      description: 'Legal and compliance review of final contract terms',
      status: 'pending',
      icon: CheckCircle,
      requirements: ['Legal approval', 'Compliance verification', 'Risk assessment'],
      timeline: '10-14 days'
    },
    {
      id: 5,
      title: 'Contract Execution',
      description: 'Final signatures and contract activation',
      status: 'pending',
      icon: Clock,
      requirements: ['Executive signatures', 'System integration', 'Go-live planning'],
      timeline: '3-5 days'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocs = Array.from(files).map(file => file.name);
      setUploadedDocuments(prev => [...prev, ...newDocs]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'active': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-slate-400 bg-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">5-Stage Payer Negotiation Process</h2>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-slate-300">Overall Progress</span>
            <span className="text-blue-400">Stage 2 of 5 (40%)</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                 style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Stages List */}
        <div className="space-y-4">
          {negotiationStages.map((stage) => {
            const IconComponent = stage.icon;
            return (
              <div
                key={stage.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  activeStage === stage.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setActiveStage(stage.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(stage.status)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                      <p className="text-slate-300 text-sm">{stage.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                      {stage.status.toUpperCase()}
                    </div>
                    <div className="text-slate-400 text-xs mt-1">{stage.timeline}</div>
                  </div>
                </div>

                {/* Stage Details */}
                {activeStage === stage.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-white font-medium mb-2">Requirements:</h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {stage.requirements.map((req, index) => (
                        <div key={index} className="text-sm text-slate-300 bg-white/5 rounded px-3 py-1">
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Document Management</h3>
        
        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center mb-4">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Upload Financial Documents</h4>
          <p className="text-slate-300 mb-4">Drag and drop files or click to browse</p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Choose Files
          </label>
        </div>

        {/* Uploaded Documents */}
        {uploadedDocuments.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-3">Uploaded Documents:</h4>
            <div className="space-y-2">
              {uploadedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">{doc}</span>
                  <span className="text-green-400 text-sm ml-auto">✓ Uploaded</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}