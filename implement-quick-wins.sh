#!/bin/bash

echo "🚀 Implementing Quick Wins for Deployment..."
echo ""

# 1. Install toast notifications
echo "📦 Installing react-hot-toast..."
npm install react-hot-toast

# 2. Create 404 page
echo "📄 Creating 404 page..."
cat > app/not-found.tsx << 'EOF'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/50"
        >
          <Home className="h-5 w-5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}
EOF

# 3. Create Loading Spinner
echo "⏳ Creating loading spinner..."
mkdir -p components/ui
cat > components/ui/LoadingSpinner.tsx << 'EOF'
export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  )
}
EOF

# 4. Create Error Boundary
echo "🛡️ Creating error boundary..."
cat > components/ErrorBoundary.tsx << 'EOF'
'use client'

import { Component, ReactNode } from 'react'
import { Home, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-400 mb-8">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Refresh Page</span>
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all"
              >
                <Home className="h-5 w-5" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
EOF

# 5. Update layout.tsx to include navigation and toast
echo "📝 Updating layout.tsx..."
# Note: This will need manual integration

echo ""
echo "✅ Quick wins implemented!"
echo ""
echo "📋 Manual steps remaining:"
echo ""
echo "1. Add to app/layout.tsx:"
echo "   import { Toaster } from 'react-hot-toast'"
echo "   import GlobalNav from '@/components/navigation/GlobalNav'"
echo "   import { ErrorBoundary } from '@/components/ErrorBoundary'"
echo ""
echo "2. Wrap your layout content:"
echo "   <ErrorBoundary>"
echo "     <GlobalNav />"
echo "     {children}"
echo "     <Toaster position=\"top-right\" />"
echo "   </ErrorBoundary>"
echo ""
echo "3. Use toast notifications:"
echo "   import toast from 'react-hot-toast'"
echo "   toast.success('✅ Success!')"
echo "   toast.error('❌ Error!')"
echo ""
echo "🎉 You're almost ready for deployment!"
