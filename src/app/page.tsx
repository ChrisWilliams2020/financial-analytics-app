"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AdvancedPlatformFeatures } from '../components/AdvancedPlatformFeatures';
import { 
  Brain, 
  Stethoscope, 
  TrendingUp, 
  Shield, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/analytics');
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning insights for healthcare optimization'
    },
    {
      icon: Stethoscope,
      title: 'Clinical Intelligence',
      description: 'Real-time patient flow and clinical decision support'
    },
    {
      icon: TrendingUp,
      title: 'Financial Analytics',
      description: 'Revenue cycle optimization and cost reduction strategies'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'HIPAA-compliant with enterprise-grade security'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Advanced Platform Features */}
      <div className="relative z-10">
        <AdvancedPlatformFeatures />
      </div>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                MedPact Analytics
                <span className="block text-blue-600">Healthcare Intelligence</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transform your healthcare operations with AI-powered analytics, 
                real-time insights, and comprehensive financial intelligence.
              </p>
            </motion.div>

            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto mb-16"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">
                    Access your healthcare analytics dashboard
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="demo@medpact.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      defaultValue="demo123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Access Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p className="bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                    Demo credentials pre-filled for easy access
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { metric: '500+', label: 'Healthcare Facilities', icon: BarChart3 },
                { metric: '99.9%', label: 'System Uptime', icon: CheckCircle },
                { metric: '$50M+', label: 'Cost Savings Generated', icon: TrendingUp }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + 0.1 * index }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 mx-auto">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.metric}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
