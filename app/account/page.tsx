'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Mail, Building2, LogOut, ArrowLeft, Shield, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your account information</p>
        </div>

        {/* Account Information Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <span>Profile Information</span>
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <p className="text-lg text-white font-semibold">
                  {session.user?.name || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/10 rounded-lg p-3">
                <Mail className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Email Address
                </label>
                <p className="text-lg text-white font-semibold">
                  {session.user?.email || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Organization */}
            {session.user?.organizationName && (
              <div className="flex items-start space-x-4">
                <div className="bg-green-500/10 rounded-lg p-3">
                  <Building2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Organization
                  </label>
                  <p className="text-lg text-white font-semibold">
                    {session.user.organizationName}
                  </p>
                </div>
              </div>
            )}

            {/* Account Created (if available) */}
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Account Status
                </label>
                <p className="text-lg text-green-400 font-semibold">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Links Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                → Dashboard
              </Link>
              <Link
                href="/analytics"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                → Analytics
              </Link>
              <Link
                href="/ai-upload"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                → AI File Upload
              </Link>
              <Link
                href="/pricing"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                → Pricing Plans
              </Link>
            </div>
          </div>

          {/* Sign Out Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Account Actions</h3>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">
              You can always sign back in anytime
            </p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-300">
            <strong>Demo Mode:</strong> Account features are for demonstration purposes. 
            In production, you can add password change, profile editing, and more features here.
          </p>
        </div>
      </div>
    </div>
  )
}
