'use client';

import { useState } from 'react';
import { Search, TrendingUp, DollarSign, Users, MapPin, Database, Wifi, CheckCircle, AlertCircle, Clock, Upload, FileText, Download, Info, Brain, AlertTriangle } from 'lucide-react';
import { AnalyticsEngine } from '../services/AnalyticsEngine';

export default function AdvancedAnalytics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('TIN');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [emrConnections, setEmrConnections] = useState({
    epic: { connected: true, lastSync: '2 mins ago', status: 'active' },
    cerner: { connected: true, lastSync: '5 mins ago', status: 'active' },
    allscripts: { connected: false, lastSync: 'Never', status: 'disconnected' },
    athenahealth: { connected: true, lastSync: '1 min ago', status: 'active' },
    nextgen: { connected: true, lastSync: '3 mins ago', status: 'active' },
    eclinicalworks: { connected: false, lastSync: '2 hours ago', status: 'error' },
    meditech: { connected: true, lastSync: '4 mins ago', status: 'active' },
    mckesson: { connected: true, lastSync: '6 mins ago', status: 'active' }
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    contracts: File | null;
    payments: File | null;
    claims: File | null;
  }>({
    contracts: null,
    payments: null,
    claims: null
  });
  const [contracts, setContracts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{
    contracts: string;
    payments: string;
    claims: string;
  }>({
    contracts: '',
    payments: '',
    claims: ''
  });
  const [analyticsEngine] = useState(() => new AnalyticsEngine());
  const [verificationResults, setVerificationResults] = useState<any>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);
  const [mlDetection, setMlDetection] = useState<any>(null);
  const [bulkAppeals, setBulkAppeals] = useState<any>(null);
  const [selectedAppeal, setSelectedAppeal] = useState<string | null>(null);

  // CSV Templates
  const csvTemplates = {
    contracts: {
      name: 'Payer_Contracts_Template.csv',
      headers: 'PayerID,PayerName,CPTCode,ContractRate,EffectiveDate,ExpirationDate,ContractType,Modifier,PlaceOfService',
      example: 'UHC001,UnitedHealthcare,99213,180.00,2024-01-01,2024-12-31,Fee-for-Service,,11\nAETNA001,Aetna,99214,245.00,2024-01-01,2024-12-31,Value-Based,,11\nBCBS001,Blue Cross Blue Shield,99215,310.00,2024-01-01,2024-12-31,Fee-for-Service,,11',
      description: 'Upload your payer contract and fee schedule data'
    },
    payments: {
      name: 'Payment_Remittance_Template.csv',
      headers: 'ClaimID,PatientAccountNumber,CPTCode,AmountBilled,AmountPaid,AdjustmentCode,AdjustmentAmount,PayerID,PayerName,PaymentDate,CheckNumber,PaymentMethod',
      example: 'CLM001234,ACC789456,99213,180.00,180.00,,,UHC001,UnitedHealthcare,2024-12-20,CHK123456,ACH\nCLM001235,ACC789457,99214,245.00,220.00,CO-45,25.00,AETNA001,Aetna,2024-12-21,CHK123457,EFT\nCLM001236,ACC789458,99215,310.00,310.00,,,BCBS001,Blue Cross,2024-12-22,CHK123458,ACH',
      description: 'Upload 835 ERA or payment posting data'
    },
    claims: {
      name: 'Claims_Export_Template.csv',
      headers: 'ClaimID,DateOfService,CPTCode,AmountBilled,PayerID,PayerName,Status,ProviderNPI,PlaceOfService,Modifiers',
      example: 'CLM001234,2024-12-10,99213,180.00,UHC001,UnitedHealthcare,Paid,1234567890,11,\nCLM001235,2024-12-11,99214,245.00,AETNA001,Aetna,Paid,1234567890,11,\nCLM001236,2024-12-12,99215,310.00,BCBS001,Blue Cross,Pending,1234567890,11,',
      description: 'Upload claims data from your practice management system'
    }
  };

  const searchTypes = [
    { value: 'TIN', label: 'Tax ID Number (TIN)' },
    { value: 'ICD', label: 'ICD-10 Codes' },
    { value: 'CPT', label: 'CPT Codes' },
    { value: 'REGION', label: 'Geographic Region' },
    { value: 'NPI', label: 'NPI Number' },
    { value: 'PAYER', label: 'Payer Contracts' },
    { value: 'CLAIMS', label: 'Claims Analysis' }
  ];

  const emrSystems = [
    { 
      id: 'epic', 
      name: 'Epic Systems', 
      logo: '🏥', 
      description: 'Epic Revenue Cycle & Billing Integration',
      marketShare: '31%',
      features: ['Revenue Cycle', 'Claims Processing', 'Payer Integration', 'Contract Management']
    },
    { 
      id: 'cerner', 
      name: 'Oracle Cerner', 
      logo: '⚕️', 
      description: 'Cerner Revenue Cycle Management',
      marketShare: '25%',
      features: ['Revenue Cycle', 'Payer Contracts', 'Claims Analytics', 'Payment Processing']
    },
    { 
      id: 'allscripts', 
      name: 'Allscripts', 
      logo: '💊', 
      description: 'Allscripts Practice Management & Billing',
      marketShare: '8%',
      features: ['Practice Management', 'Billing', 'Insurance Verification', 'Payment Posting']
    },
    { 
      id: 'athenahealth', 
      name: 'athenahealth', 
      logo: '🔬', 
      description: 'athenaCollector Revenue Cycle',
      marketShare: '5%',
      features: ['Revenue Cycle', 'Claims Management', 'Payment Processing', 'Payer Analytics']
    },
    { 
      id: 'nextgen', 
      name: 'NextGen Healthcare', 
      logo: '🩺', 
      description: 'NextGen Practice Management',
      marketShare: '4%',
      features: ['Practice Management', 'Billing', 'Insurance Claims', 'Payment Reconciliation']
    },
    { 
      id: 'eclinicalworks', 
      name: 'eClinicalWorks', 
      logo: '💻', 
      description: 'eCW Practice Management & RCM',
      marketShare: '3%',
      features: ['Practice Management', 'Revenue Cycle', 'Claims', 'Payment Gateway']
    },
    { 
      id: 'meditech', 
      name: 'MEDITECH', 
      logo: '🏨', 
      description: 'MEDITECH Revenue Cycle',
      marketShare: '16%',
      features: ['Revenue Cycle', 'Payer Management', 'Claims Processing', 'Financial Analytics']
    },
    { 
      id: 'mckesson', 
      name: 'McKesson', 
      logo: '🚑', 
      description: 'McKesson Revenue Management',
      marketShare: '2%',
      features: ['Revenue Management', 'Claims Processing', 'Payer Contracts', 'Financial Analytics']
    }
  ];

  // Download CSV template
  const downloadTemplate = (templateType: 'contracts' | 'payments' | 'claims') => {
    const template = csvTemplates[templateType];
    const csvContent = `${template.headers}\n${template.example}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', template.name);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (fileType: 'contracts' | 'payments' | 'claims', file: File) => {
    setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
    setProcessingStatus(prev => ({ ...prev, [fileType]: 'Processing...' }));
    
    // Parse and process the file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      try {
        if (fileType === 'contracts') {
          await processContractFile(content);
          setProcessingStatus(prev => ({ ...prev, contracts: `✓ ${contracts.length} contracts loaded` }));
        } else if (fileType === 'payments') {
          await processPaymentFile(content);
          setProcessingStatus(prev => ({ ...prev, payments: `✓ ${payments.length} payments loaded` }));
        } else if (fileType === 'claims') {
          await processClaimsFile(content);
          setProcessingStatus(prev => ({ ...prev, claims: `✓ ${claims.length} claims loaded` }));
        }
      } catch (error) {
        setProcessingStatus(prev => ({ 
          ...prev, 
          [fileType]: `❌ Error: ${error instanceof Error ? error.message : 'Invalid file format'}` 
        }));
      }
    };
    
    reader.readAsText(file);
  };

  // Parse CSV helper function
  const parseCSV = (content: string): string[][] => {
    const lines = content.trim().split('\n');
    return lines.map(line => {
      // Handle quoted fields with commas
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());
      
      return fields;
    });
  };

  const processContractFile = async (content: string) => {
    const rows = parseCSV(content);
    const headers = rows[0];
    
    const requiredHeaders = ['PayerID', 'PayerName', 'CPTCode', 'ContractRate'];
    const hasRequiredHeaders = requiredHeaders.every(h => 
      headers.some(header => header.toLowerCase().includes(h.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
      throw new Error('Missing required headers. Please use the template format.');
    }
    
    const contractData = rows.slice(1)
      .filter(row => row.length > 1 && row[0])
      .map(row => ({
        payerId: row[0],
        payerName: row[1],
        cptCode: row[2],
        contractRate: parseFloat(row[3]) || 0,
        effectiveDate: row[4] || '',
        expirationDate: row[5] || '',
        contractType: row[6] || 'Fee-for-Service',
        modifier: row[7] || '',
        placeOfService: row[8] || '11'
      }));
    
    setContracts(contractData);
    
    // Update status AFTER state is set
    setTimeout(() => {
      setProcessingStatus(prev => ({ 
        ...prev, 
        contracts: `✓ ${contractData.length} contracts loaded` 
      }));
      
      // Update analytics engine with new data
      analyticsEngine.loadData({
        contracts: contractData,
        payments: payments,
        claims: claims
      });
    }, 100);
    
    console.log('✓ Contracts loaded:', contractData.length);
  };

  const processPaymentFile = async (content: string) => {
    // Check if it's 835 ERA format or CSV
    if (content.includes('ST*835') || content.includes('ISA*')) {
      await parse835ERA(content);
    } else {
      await parsePaymentCSV(content);
    }
  };

  const parse835ERA = async (content: string) => {
    // Parse ANSI X12 835 Electronic Remittance Advice
    const segments = content.split('~').map(s => s.trim()).filter(s => s);
    const paymentData: any[] = [];
    let currentClaim: any = {};
    
    for (const segment of segments) {
      const elements = segment.split('*');
      const segmentId = elements[0];
      
      switch (segmentId) {
        case 'BPR': // Payment header
          currentClaim.paymentAmount = parseFloat(elements[2]) || 0;
          currentClaim.paymentMethod = elements[4];
          currentClaim.paymentDate = elements[16];
          break;
          
        case 'N1': // Payer name
          if (elements[1] === 'PR') {
            currentClaim.payerName = elements[2];
          }
          break;
          
        case 'REF': // Reference numbers
          if (elements[1] === 'EV') {
            currentClaim.payerId = elements[2];
          }
          break;
          
        case 'CLP': // Claim payment
          if (Object.keys(currentClaim).length > 0) {
            paymentData.push({ ...currentClaim });
          }
          currentClaim = {
            claimId: elements[1],
            claimStatus: elements[2],
            amountBilled: parseFloat(elements[3]) || 0,
            amountPaid: parseFloat(elements[4]) || 0
          };
          break;
          
        case 'SVC': // Service line
          const cptMatch = elements[1].match(/HC:(\d+)/);
          if (cptMatch) {
            currentClaim.cptCode = cptMatch[1];
          }
          break;
      }
    }
    
    if (Object.keys(currentClaim).length > 0) {
      paymentData.push(currentClaim);
    }
    
    setPayments(paymentData);
    console.log('✓ 835 ERA payments loaded:', paymentData.length);
  };

  const parsePaymentCSV = async (content: string) => {
    const rows = parseCSV(content);
    const headers = rows[0];
    
    const requiredHeaders = ['ClaimID', 'CPTCode', 'AmountPaid', 'PayerID'];
    const hasRequiredHeaders = requiredHeaders.every(h => 
      headers.some(header => header.toLowerCase().includes(h.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
      throw new Error('Missing required payment headers. Please use the template format.');
    }
    
    const paymentData = rows.slice(1)
      .filter(row => row.length > 1 && row[0])
      .map(row => ({
        claimId: row[0],
        patientAccountNumber: row[1],
        cptCode: row[2],
        amountBilled: parseFloat(row[3]) || 0,
        amountPaid: parseFloat(row[4]) || 0,
        adjustmentCode: row[5] || '',
        adjustmentAmount: parseFloat(row[6]) || 0,
        payerId: row[7],
        payerName: row[8],
        paymentDate: row[9],
        checkNumber: row[10] || '',
        paymentMethod: row[11] || 'Check'
      }));
    
    setPayments(paymentData);
    
    setTimeout(() => {
      setProcessingStatus(prev => ({ 
        ...prev, 
        payments: `✓ ${paymentData.length} payments loaded` 
      }));
    }, 100);
    
    console.log('✓ CSV payments loaded:', paymentData.length);
  };

  const processClaimsFile = async (content: string) => {
    const rows = parseCSV(content);
    const headers = rows[0];
    
    const requiredHeaders = ['ClaimID', 'DateOfService', 'CPTCode', 'AmountBilled'];
    const hasRequiredHeaders = requiredHeaders.every(h => 
      headers.some(header => header.toLowerCase().includes(h.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
      throw new Error('Missing required claims headers. Please use the template format.');
    }
    
    const claimsData = rows.slice(1)
      .filter(row => row.length > 1 && row[0])
      .map(row => ({
        claimId: row[0],
        dateOfService: row[1],
        cptCode: row[2],
        amountBilled: parseFloat(row[3]) || 0,
        payerId: row[4],
        payerName: row[5],
        status: row[6] || 'Pending',
        providerNpi: row[7],
        placeOfService: row[8] || '11',
        modifiers: row[9] || ''
      }));
    
    setClaims(claimsData);
    
    setTimeout(() => {
      setProcessingStatus(prev => ({ 
        ...prev, 
        claims: `✓ ${claimsData.length} claims loaded` 
      }));
    }, 100);
    
    console.log('✓ Claims loaded:', claimsData.length);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = {
      TIN: [
        { id: '123456789', name: 'Metro Health System', region: 'Northeast', revenue: '$45.2M', claimsVolume: 12450, avgReimbursement: '$3,450', emrSystem: 'Epic' },
        { id: '987654321', name: 'Regional Medical Center', region: 'Southeast', revenue: '$32.1M', claimsVolume: 8920, avgReimbursement: '$2,890', emrSystem: 'Cerner' }
      ],
      PAYER: contracts.map(c => ({
        payerId: c.payerId,
        payerName: c.payerName,
        cptCode: c.cptCode,
        contractRate: `$${c.contractRate}`,
        contractType: c.contractType
      })),
      CLAIMS: claims.map(c => ({
        claimId: c.claimId,
        dateOfService: c.dateOfService,
        cptCode: c.cptCode,
        amountBilled: `$${c.amountBilled}`,
        status: c.status,
        payerName: c.payerName
      }))
    };

    setSearchResults(mockResults[searchType as keyof typeof mockResults] || []);
    setIsSearching(false);
  };

  const getConnectionStatus = (status: string) => {
    switch (status) {
      case 'active': return { color: 'text-green-400', icon: CheckCircle, bg: 'bg-green-500/20 border-green-500/30' };
      case 'error': return { color: 'text-red-400', icon: AlertCircle, bg: 'bg-red-500/20 border-red-500/30' };
      case 'disconnected': return { color: 'text-slate-400', icon: Clock, bg: 'bg-slate-500/20 border-slate-500/30' };
      default: return { color: 'text-slate-400', icon: Clock, bg: 'bg-slate-500/20 border-slate-500/30' };
    }
  };

  const toggleEmrConnection = (emrId: string) => {
    setEmrConnections(prev => ({
      ...prev,
      [emrId]: {
        ...prev[emrId as keyof typeof prev],
        connected: !prev[emrId as keyof typeof prev].connected,
        status: prev[emrId as keyof typeof prev].connected ? 'disconnected' : 'active',
        lastSync: prev[emrId as keyof typeof prev].connected ? 'Never' : 'Just now'
      }
    }));
  };

  // Add analytics refresh function
  const refreshAnalytics = () => {
    if (contracts.length > 0 && payments.length > 0) {
      analyticsEngine.loadData({ contracts, payments, claims });
      
      const verification = analyticsEngine.verifyPayments();
      setVerificationResults(verification);
      
      const revenue = analyticsEngine.getRevenueAnalytics();
      setRevenueAnalytics(revenue);
      
      const compliance = analyticsEngine.getContractCompliance();
      setComplianceData(compliance);
    }
  };

  const runMLDetection = () => {
    if (contracts.length > 0 && payments.length > 0) {
      analyticsEngine.loadData({ contracts, payments, claims });
      const detection = analyticsEngine.detectUnderpaymentPatterns();
      setMlDetection(detection);
    }
  };

  const generateAppeals = () => {
    if (contracts.length > 0 && payments.length > 0) {
      analyticsEngine.loadData({ contracts, payments, claims });
      const appeals = analyticsEngine.generateBulkAppeals(5); // 5% minimum variance
      setBulkAppeals(appeals);
    }
  };

  const downloadAppealLetter = (claimId: string) => {
    const appeal = analyticsEngine.generateAppeal(claimId);
    if (!appeal) return;

    const blob = new Blob([appeal.appealLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appeal_${claimId}_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  const tabs = [
    { id: 'upload', label: 'File Upload', icon: Upload },
    { id: 'search', label: 'Data Search', icon: Search },
    { id: 'emr', label: 'PM Integration', icon: Database },
    { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
    { id: 'ml-detection', label: 'ML Detection', icon: Brain },
    { id: 'appeals', label: 'Auto Appeals', icon: FileText }
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 font-semibold'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'upload' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Upload Practice Management Files</h2>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>{showTemplates ? 'Hide' : 'Show'} Templates</span>
            </button>
          </div>

          {/* CSV Template Preview */}
          {showTemplates && (
            <div className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h4 className="text-blue-400 font-semibold mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>📋 Required CSV File Formats</span>
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(csvTemplates).map(([key, template]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-2">{template.name}</h5>
                    <p className="text-slate-300 text-sm mb-3">{template.description}</p>
                    
                    <div className="bg-slate-900 rounded p-3 mb-3 overflow-x-auto">
                      <div className="text-green-400 text-xs font-mono mb-2">Headers:</div>
                      <div className="text-slate-300 text-xs font-mono whitespace-pre">
                        {template.headers}
                      </div>
                      <div className="text-green-400 text-xs font-mono mt-3 mb-2">Example:</div>
                      <div className="text-slate-300 text-xs font-mono whitespace-pre">
                        {template.example.split('\n')[0]}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => downloadTemplate(key as 'contracts' | 'payments' | 'claims')}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors w-full justify-center"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Template</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* File Upload Sections */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Contract Files Upload */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-blue-400" />
                <h3 className="text-white font-semibold">Payer Contracts</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Upload contract/fee schedule files (CSV)
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('contracts', file);
                }}
                className="hidden"
                id="contracts-upload"
              />
              <label
                htmlFor="contracts-upload"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center cursor-pointer transition-colors mb-2"
              >
                {uploadedFiles.contracts ? 'File Uploaded ✓' : 'Select File'}
              </label>
              {uploadedFiles.contracts && (
                <div className="space-y-1">
                  <p className="text-green-400 text-xs">{uploadedFiles.contracts.name}</p>
                  <p className="text-slate-400 text-xs">{processingStatus.contracts}</p>
                </div>
              )}
            </div>

            {/* Payment Files Upload */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="h-6 w-6 text-green-400" />
                <h3 className="text-white font-semibold">Payment Data</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Upload 835 ERA or payment CSV files
              </p>
              <input
                type="file"
                accept=".835,.txt,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('payments', file);
                }}
                className="hidden"
                id="payments-upload"
              />
              <label
                htmlFor="payments-upload"
                className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center cursor-pointer transition-colors mb-2"
              >
                {uploadedFiles.payments ? 'File Uploaded ✓' : 'Select File'}
              </label>
              {uploadedFiles.payments && (
                <div className="space-y-1">
                  <p className="text-green-400 text-xs">{uploadedFiles.payments.name}</p>
                  <p className="text-slate-400 text-xs">{processingStatus.payments}</p>
                </div>
              )}
            </div>

            {/* Claims Files Upload */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-purple-400" />
                <h3 className="text-white font-semibold">Claims Data</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Upload claims export files (CSV)
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('claims', file);
                }}
                className="hidden"
                id="claims-upload"
              />
              <label
                htmlFor="claims-upload"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center cursor-pointer transition-colors mb-2"
              >
                {uploadedFiles.claims ? 'File Uploaded ✓' : 'Select File'}
              </label>
              {uploadedFiles.claims && (
                <div className="space-y-1">
                  <p className="text-green-400 text-xs">{uploadedFiles.claims.name}</p>
                  <p className="text-slate-400 text-xs">{processingStatus.claims}</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Preview */}
          {(contracts.length > 0 || payments.length > 0 || claims.length > 0) && (
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">✓ Uploaded Data Summary</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {contracts.length > 0 && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-400 font-semibold mb-2">Contracts Loaded</div>
                    <div className="text-2xl text-white font-bold">{contracts.length}</div>
                    <div className="text-xs text-slate-300 mt-2">
                      {contracts.length} payer contracts ready for verification
                    </div>
                  </div>
                )}
                {payments.length > 0 && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2">Payments Loaded</div>
                    <div className="text-2xl text-white font-bold">{payments.length}</div>
                    <div className="text-xs text-slate-300 mt-2">
                      Total: ${payments.reduce((sum, p) => sum + p.amountPaid, 0).toFixed(2)}
                    </div>
                  </div>
                )}
                {claims.length > 0 && (
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="text-purple-400 font-semibold mb-2">Claims Loaded</div>
                    <div className="text-2xl text-white font-bold">{claims.length}</div>
                    <div className="text-xs text-slate-300 mt-2">
                      Total Billed: ${claims.reduce((sum, c) => sum + c.amountBilled, 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PM System Instructions */}
          <div className="mt-8 bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
            <h4 className="text-orange-400 font-semibold mb-3">📋 How to Export from Your PM System</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-white font-medium mb-2">NextGen Healthcare:</p>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li>1. Navigate to Reports → Fee Schedules</li>
                  <li>2. Select date range and payers</li>
                  <li>3. Export as CSV</li>
                  <li>4. For payments: Reports → Payment Posting</li>
                  <li>5. For claims: Reports → Claims Management</li>
                </ul>
              </div>
              <div>
                <p className="text-white font-medium mb-2">Epic Systems:</p>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li>1. Navigate to Revenue → Contracts</li>
                  <li>2. Use Export Wizard</li>
                  <li>3. Select CSV format</li>
                  <li>4. For 835: Revenue → ERA Management</li>
                  <li>5. Download and save as .835 or CSV</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Search Uploaded Data</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-slate-300 text-sm mb-2 block">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  {searchTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-slate-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="text-slate-300 text-sm mb-2 block">Search Query</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Enter ${searchType} to search...`}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>{isSearching ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">Search Results ({searchResults.length})</h3>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4">
                      <div className="grid md:grid-cols-5 gap-4 text-sm">
                        {Object.entries(result).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-slate-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-white">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'emr' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Practice Management System Integration</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Connected Systems</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Object.values(emrConnections).filter(conn => conn.connected).length}
                </div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Contracts Loaded</span>
                </div>
                <div className="text-2xl font-bold text-white">{contracts.length}</div>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold">Claims Tracked</span>
                </div>
                <div className="text-2xl font-bold text-white">{claims.length}</div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Payments Logged</span>
                </div>
                <div className="text-2xl font-bold text-white">{payments.length}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {emrSystems.map((emr) => {
                const connection = emrConnections[emr.id as keyof typeof emrConnections];
                const statusConfig = getConnectionStatus(connection.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={emr.id} className={`${statusConfig.bg} border rounded-xl p-6 transition-all hover:scale-105`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{emr.logo}</div>
                        <div>
                          <h3 className="text-white font-semibold">{emr.name}</h3>
                          <div className="text-xs text-slate-400">{emr.marketShare} market share</div>
                        </div>
                      </div>
                      <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{emr.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {emr.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="text-xs text-slate-400">
                          • {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-slate-400">Last Sync:</span>
                      <span className="text-xs text-slate-300">{connection.lastSync}</span>
                    </div>
                    
                    <button
                      onClick={() => toggleEmrConnection(emr.id)}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        connection.connected
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {connection.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Revenue Analytics & Contract Verification</h2>
              <button
                onClick={refreshAnalytics}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Refresh Analytics</span>
              </button>
            </div>
            
            {/* Verification Results */}
            {verificationResults && (
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-400 font-semibold mb-2">Matching Payments</div>
                  <div className="text-2xl text-white font-bold">{verificationResults.matchingPayments}</div>
                  <div className="text-xs text-slate-300 mt-2">
                    {verificationResults.accuracyRate.toFixed(1)}% accuracy
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="text-red-400 font-semibold mb-2">Underpayments</div>
                  <div className="text-2xl text-white font-bold">{verificationResults.underpayments}</div>
                  <div className="text-xs text-slate-300 mt-2">
                    ${Math.abs(verificationResults.totalVariance).toFixed(2)} variance
                  </div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Total Payments</div>
                  <div className="text-2xl text-white font-bold">{verificationResults.totalPayments}</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-purple-400 font-semibold mb-2">Compliance Rate</div>
                  <div className="text-2xl text-white font-bold">{verificationResults.accuracyRate.toFixed(1)}%</div>
                </div>
              </div>
            )}

            {/* Revenue Analytics */}
            {revenueAnalytics && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Revenue Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Billed:</span>
                      <span className="text-green-400">${revenueAnalytics.totalBilled.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Paid:</span>
                      <span className="text-blue-400">${revenueAnalytics.totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Collection Rate:</span>
                      <span className="text-purple-400">{revenueAnalytics.collectionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Outstanding:</span>
                      <span className="text-orange-400">${revenueAnalytics.outstandingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Contract Compliance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Contracts:</span>
                      <span className="text-green-400">{complianceData?.totalContracts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Active Contracts:</span>
                      <span className="text-blue-400">{complianceData?.activeContracts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Expiring Soon:</span>
                      <span className="text-orange-400">{complianceData?.expiringContracts || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payer Performance Table */}
            {revenueAnalytics?.payerBreakdown && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Payer Performance</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-slate-400 pb-2">Payer</th>
                        <th className="text-right text-slate-400 pb-2">Billed</th>
                        <th className="text-right text-slate-400 pb-2">Paid</th>
                        <th className="text-right text-slate-400 pb-2">Collection Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueAnalytics.payerBreakdown.map((payer: any, index: number) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-2 text-white">{payer.payerName}</td>
                          <td className="py-2 text-right text-green-400">${payer.totalBilled.toFixed(2)}</td>
                          <td className="py-2 text-right text-blue-400">${payer.totalPaid.toFixed(2)}</td>
                          <td className="py-2 text-right text-purple-400">{payer.collectionRate.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ml-detection' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">🤖 ML-Based Underpayment Detection</h2>
                <p className="text-slate-300 text-sm">Machine learning powered analysis to detect suspicious payment patterns</p>
              </div>
              <button
                onClick={runMLDetection}
                disabled={!contracts.length || !payments.length}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>Run ML Analysis</span>
              </button>
            </div>

            {!mlDetection && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">No Analysis Run Yet</p>
                <p className="text-slate-300 text-sm">Upload contracts and payments, then click "Run ML Analysis" to detect patterns</p>
              </div>
            )}

            {mlDetection && (
              <>
                {/* Risk Overview */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2">Suspicious Payments</div>
                    <div className="text-3xl text-white font-bold">{mlDetection.suspiciousPayments.length}</div>
                    <div className="text-xs text-slate-300 mt-2">
                      Flagged by ML algorithm
                    </div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2">High-Risk Payers</div>
                    <div className="text-3xl text-white font-bold">
                      {Array.from(mlDetection.payerRiskScores.values()).filter(s => s > 30).length}
                    </div>
                    <div className="text-xs text-slate-300 mt-2">
                      {'>'}30% underpayment rate
                    </div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2">Total at Risk</div>
                    <div className="text-3xl text-white font-bold">
                      ${mlDetection.suspiciousPayments.reduce((sum: number, p: any) => sum + Math.abs(p.variance), 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-300 mt-2">
                      Potential revenue recovery
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {mlDetection.recommendations.length > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
                    <h4 className="text-purple-400 font-semibold mb-4 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>AI Recommendations</span>
                    </h4>
                    <div className="space-y-2">
                      {mlDetection.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="text-purple-400 mt-1">•</div>
                          <div className="text-white text-sm">{rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suspicious Payments Table */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4">Detected Underpayment Patterns</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-slate-400 pb-2">Risk</th>
                          <th className="text-left text-slate-400 pb-2">Claim ID</th>
                          <th className="text-left text-slate-400 pb-2">Payer</th>
                          <th className="text-left text-slate-400 pb-2">CPT</th>
                          <th className="text-right text-slate-400 pb-2">Expected</th>
                          <th className="text-right text-slate-400 pb-2">Actual</th>
                          <th className="text-right text-slate-400 pb-2">Variance</th>
                          <th className="text-left text-slate-400 pb-2">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mlDetection.suspiciousPayments.map((payment: any, index: number) => {
                          const riskColors = {
                            CRITICAL: 'text-red-400',
                            HIGH: 'text-orange-400',
                            MEDIUM: 'text-yellow-400',
                            LOW: 'text-green-400'
                          };
                          const riskColor = riskColors[payment.riskLevel as keyof typeof riskColors] || 'text-slate-400';

                          return (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                              <td className={`py-3 font-semibold ${riskColor}`}>{payment.riskLevel}</td>
                              <td className="py-3 text-white">{payment.claimId}</td>
                              <td className="py-3 text-slate-300">{payment.payerName}</td>
                              <td className="py-3 text-blue-400">{payment.cptCode}</td>
                              <td className="py-3 text-right text-green-400">${payment.expectedAmount.toFixed(2)}</td>
                              <td className="py-3 text-right text-red-400">${payment.actualAmount.toFixed(2)}</td>
                              <td className="py-3 text-right text-orange-400">{payment.variancePercent.toFixed(1)}%</td>
                              <td className="py-3 text-slate-300 text-xs">{payment.reason}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payer Risk Scores */}
                <div className="bg-white/5 rounded-lg p-4 mt-6">
                  <h4 className="text-white font-medium mb-4">Payer Risk Scores</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from(mlDetection.payerRiskScores.entries())
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([payerId, score]: [string, number]) => {
                        const payerName = payments.find((p: any) => p.payerId === payerId)?.payerName || payerId;
                        const riskColor = score > 50 ? 'bg-red-500' : score > 30 ? 'bg-orange-500' : score > 15 ? 'bg-yellow-500' : 'bg-green-500';
                        
                        return (
                          <div key={payerId} className="bg-white/5 rounded p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm font-medium">{payerName}</span>
                              <span className="text-slate-300 text-sm">{score.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className={`${riskColor} h-2 rounded-full transition-all`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'appeals' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">📝 Automated Appeals Generation</h2>
                <p className="text-slate-300 text-sm">Generate professional appeal letters for underpayments automatically</p>
              </div>
              <button
                onClick={generateAppeals}
                disabled={!contracts.length || !payments.length}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Generate Appeals</span>
              </button>
            </div>

            {!bulkAppeals && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">No Appeals Generated Yet</p>
                <p className="text-slate-300 text-sm">Click "Generate Appeals" to create appeal letters for underpaid claims</p>
              </div>
            )}

            {bulkAppeals && (
              <>
                {/* Appeals Summary */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2">Urgent Appeals</div>
                    <div className="text-3xl text-white font-bold">{bulkAppeals.priorityCounts.urgent}</div>
                    <div className="text-xs text-slate-300 mt-2">{'>'}20% variance</div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2">High Priority</div>
                    <div className="text-3xl text-white font-bold">{bulkAppeals.priorityCounts.high}</div>
                    <div className="text-xs text-slate-300 mt-2">10-20% variance</div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2">Medium Priority</div>
                    <div className="text-3xl text-white font-bold">{bulkAppeals.priorityCounts.medium}</div>
                    <div className="text-xs text-slate-300 mt-2">5-10% variance</div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2">Total Recoverable</div>
                    <div className="text-3xl text-white font-bold">${bulkAppeals.totalRecoverable.toFixed(2)}</div>
                    <div className="text-xs text-slate-300 mt-2">Potential recovery</div>
                  </div>
                </div>

                {/* Appeals List */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4">Generated Appeals ({bulkAppeals.appeals.length})</h4>
                  <div className="space-y-3">
                    {bulkAppeals.appeals.map((appeal: any, index: number) => {
                      const priorityColors = {
                        URGENT: 'border-red-500/50 bg-red-500/10',
                        HIGH: 'border-orange-500/50 bg-orange-500/10',
                        MEDIUM: 'border-yellow-500/50 bg-yellow-500/10'
                      };
                      const priorityColor = priorityColors[appeal.priority as keyof typeof priorityColors] || 'border-white/20 bg-white/5';

                      return (
                        <div key={index} className={`border rounded-lg p-4 ${priorityColor}`}>
                          <div className="grid md:grid-cols-6 gap-4 items-center">
                            <div>
                              <div className="text-slate-400 text-xs">Claim ID</div>
                              <div className="text-white font-medium">{appeal.claimId}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Payer</div>
                              <div className="text-white">{appeal.payerName}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Amount</div>
                              <div className="text-green-400 font-semibold">${appeal.amount.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Priority</div>
                              <div className={`font-semibold ${
                                appeal.priority === 'URGENT' ? 'text-red-400' :
                                appeal.priority === 'HIGH' ? 'text-orange-400' : 'text-yellow-400'
                              }`}>
                                {appeal.priority}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Deadline</div>
                              <div className="text-slate-300">{appeal.deadline}</div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => downloadAppealLetter(appeal.claimId)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                              <button
                                onClick={() => setSelectedAppeal(selectedAppeal === appeal.claimId ? null : appeal.claimId)}
                                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded text-sm transition-colors"
                              >
                                {selectedAppeal === appeal.claimId ? 'Hide' : 'View'}
                              </button>
                            </div>
                          </div>

                          {/* Appeal Letter Preview */}
                          {selectedAppeal === appeal.claimId && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="bg-slate-900 rounded p-4 max-h-96 overflow-y-auto">
                                <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono">
                                  {appeal.appealLetter}
                                </pre>
                              </div>
                              <div className="mt-4">
                                <h5 className="text-white text-sm font-medium mb-2">Required Supporting Documents:</h5>
                                <ul className="text-slate-300 text-xs space-y-1">
                                  {appeal.supportingDocuments.map((doc: string, i: number) => (
                                    <li key={i}>• {doc}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}