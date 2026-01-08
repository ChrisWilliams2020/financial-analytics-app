'use client'

import { useState } from 'react'
import { Upload, FileText, Zap, CheckCircle, AlertCircle, Brain, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AIUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [templateType, setTemplateType] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !templateType) {
      setError('Please select a file and template type')
      return
    }

    setProcessing(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('templateType', templateType)

    try {
      const response = await fetch('/api/upload/process', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.data)
      } else {
        setError(data.error || 'Failed to process file')
      }
    } catch (err) {
      setError('An error occurred while processing the file')
    } finally {
      setProcessing(false)
    }
  }

  const templates = [
    { value: 'era', label: 'ERA (Electronic Remittance Advice)', icon: FileText },
    { value: 'eob', label: 'EOB (Explanation of Benefits)', icon: FileText },
    { value: 'claim', label: 'Claim File', icon: FileText },
    { value: 'contract', label: 'Contract Agreement', icon: FileText },
    { value: 'pricing', label: 'Fee Schedule', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">AI File Processor</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">5-Step Intelligent Processing</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Upload & Process Your Healthcare Files
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Our AI agent automatically identifies templates, validates data, and populates your records with 95%+ accuracy
          </p>
        </div>

        {/* Processing Steps */}
        <div className="grid md:grid-cols-5 gap-4 mb-12">
          {[
            { step: 1, title: 'Upload', icon: Upload },
            { step: 2, title: 'Identify', icon: Brain },
            { step: 3, title: 'Validate', icon: CheckCircle },
            { step: 4, title: 'Process', icon: Zap },
            { step: 5, title: 'Populate', icon: TrendingUp },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center hover:scale-105 transition-all"
            >
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <item.icon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-slate-500 text-xs mb-1">Step {item.step}</div>
              <div className="text-white font-semibold text-sm">{item.title}</div>
            </div>
          ))}
        </div>

        {/* Upload Form */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                1. Select Template Type
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    type="button"
                    onClick={() => setTemplateType(template.value)}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      templateType === template.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'
                    }`}
                  >
                    <template.icon className={`h-5 w-5 ${
                      templateType === template.value ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      templateType === template.value ? 'text-blue-400' : 'text-slate-300'
                    }`}>
                      {template.label}
                    </span>
                    {templateType === template.value && (
                      <CheckCircle className="h-5 w-5 text-blue-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                2. Upload File
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls,.pdf,.txt"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  {file ? (
                    <div className="space-y-2">
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-slate-400 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-white font-semibold">
                        Drag & drop your file here
                      </p>
                      <p className="text-slate-400 text-sm">
                        or click to browse
                      </p>
                      <p className="text-slate-500 text-xs">
                        Supports CSV, Excel, PDF, TXT
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold">Error</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || !templateType || processing}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                !file || !templateType || processing
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="h-5 w-5 animate-pulse" />
                  <span>Processing with AI...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Process File with AI</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500/20 rounded-full p-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Processing Complete!</h3>
                <p className="text-green-400">{result.message}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">File Name</div>
                <div className="text-white font-semibold text-lg">{result.fileName}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Template Type</div>
                <div className="text-white font-semibold text-lg uppercase">{result.templateType}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Confidence Score</div>
                <div className="text-green-400 font-bold text-3xl">{result.confidence}%</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="text-slate-400 text-sm mb-1">Rows Processed</div>
                <div className="text-white font-semibold text-lg">{result.rowsProcessed} / {result.rowsPopulated} populated</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setFile(null)
                  setTemplateType('')
                  setResult(null)
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Process Another File
              </button>
              <Link
                href="/analytics"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                View Analytics Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <Brain className="h-10 w-10 text-blue-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Smart Template Detection</h3>
            <p className="text-slate-400 text-sm">
              AI automatically identifies document types and formats
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <Zap className="h-10 w-10 text-purple-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Lightning Fast Processing</h3>
            <p className="text-slate-400 text-sm">
              Process thousands of rows in seconds with 95%+ accuracy
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <CheckCircle className="h-10 w-10 text-green-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Data Validation</h3>
            <p className="text-slate-400 text-sm">
              Automatic validation and error detection before population
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
