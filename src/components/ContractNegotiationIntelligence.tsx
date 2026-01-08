/**
 * Contract Negotiation Intelligence Component
 * Uses facility quality scores and payer data for contract leverage
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MedPactResearchClient from '@/lib/medpact-research-client';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Shield,
  DollarSign,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface NegotiationIntelligence {
  facilityStrengths: string[];
  payerInsights: string[];
  negotiationLeverage: 'strong' | 'moderate' | 'weak';
  recommendedStrategy: string;
  keyMetrics: {
    facilityQuality: number;
    patientSatisfaction: number;
    bedCapacity: number;
    payerStarRating: number;
    payerEnrollment: number;
  };
}

export function ContractNegotiationIntelligence({
  cmsCertification,
  payerContract,
  facilityName,
  payerName
}: {
  cmsCertification?: string;
  payerContract?: string;
  facilityName?: string;
  payerName?: string;
}) {
  const [intelligence, setIntelligence] = useState<NegotiationIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIntelligence = async () => {
    if (!cmsCertification && !payerContract) {
      setError('Provide facility CMS certification or payer contract number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new MedPactResearchClient('http://localhost:3001');
      
      let facilityData: any = null;
      let payerData: any = null;

      // Fetch facility intelligence
      if (cmsCertification) {
        const facilityResult = await client.searchFacility(cmsCertification);
        if (facilityResult.success) {
          facilityData = facilityResult.data;
        }
      }

      // Fetch payer intelligence
      if (payerContract) {
        const payerResult = await client.searchPayer(payerContract);
        if (payerResult.success) {
          payerData = payerResult.data;
        }
      }

      // Generate intelligence insights
      const strengths: string[] = [];
      const payerInsights: string[] = [];
      let leverage: 'strong' | 'moderate' | 'weak' = 'moderate';

      if (facilityData) {
        if (facilityData.overall_quality_rating >= 4) {
          strengths.push(`Excellent CMS quality rating (${facilityData.overall_quality_rating}/5) - well above average`);
          leverage = 'strong';
        } else if (facilityData.overall_quality_rating >= 3) {
          strengths.push(`Good CMS quality rating (${facilityData.overall_quality_rating}/5)`);
        }

        if (facilityData.hcahps_overall_rating >= 8) {
          strengths.push(`High patient satisfaction (${facilityData.hcahps_overall_rating}/10) demonstrates care quality`);
        }

        if (facilityData.bed_count >= 300) {
          strengths.push(`Large facility capacity (${facilityData.bed_count} beds) = high volume potential`);
        }

        if (facilityData.hcahps_communication_with_nurses >= 80) {
          strengths.push(`Exceptional nurse communication scores (${facilityData.hcahps_communication_with_nurses}%)`);
        }
      }

      if (payerData) {
        if (payerData.overall_star_rating >= 4) {
          payerInsights.push(`High-performing payer (${payerData.overall_star_rating}/5 stars) values quality partners`);
        }

        if (payerData.enrollment_count >= 40000) {
          payerInsights.push(`Large member base (${payerData.enrollment_count.toLocaleString()} members) = volume opportunity`);
        }

        if (payerData.overall_star_rating < 4 && facilityData?.overall_quality_rating >= 4) {
          payerInsights.push(`Payer needs quality improvement - your facility can help boost their ratings`);
          leverage = 'strong';
        }
      }

      const strategy = generateStrategy(facilityData, payerData, leverage);

      setIntelligence({
        facilityStrengths: strengths,
        payerInsights,
        negotiationLeverage: leverage,
        recommendedStrategy: strategy,
        keyMetrics: {
          facilityQuality: facilityData?.overall_quality_rating || 0,
          patientSatisfaction: facilityData?.hcahps_overall_rating || 0,
          bedCapacity: facilityData?.bed_count || 0,
          payerStarRating: payerData?.overall_star_rating || 0,
          payerEnrollment: payerData?.enrollment_count || 0
        }
      });

    } catch (err) {
      console.error('Error generating intelligence:', err);
      setError('Failed to generate negotiation intelligence');
    } finally {
      setLoading(false);
    }
  };

  const generateStrategy = (facilityData: any, payerData: any, leverage: string): string => {
    if (leverage === 'strong') {
      return `Leverage your superior quality metrics (${facilityData?.overall_quality_rating}/5 rating) to negotiate for 3-5% higher rates. Emphasize patient satisfaction scores that exceed regional averages. Position as a strategic quality partner that can enhance payer's star ratings.`;
    } else if (leverage === 'moderate') {
      return `Focus on volume commitments and care coordination capabilities. Highlight specific quality improvement initiatives and patient outcomes. Consider performance-based incentives tied to quality metrics.`;
    } else {
      return `Emphasize operational efficiency and cost management. Propose value-based arrangements with shared savings opportunities. Focus on specific service lines where you excel.`;
    }
  };

  useEffect(() => {
    if (cmsCertification || payerContract) {
      generateIntelligence();
    }
  }, [cmsCertification, payerContract]);

  const getLeverageColor = (leverage: string) => {
    switch (leverage) {
      case 'strong': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'weak': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLeverageIcon = (leverage: string) => {
    switch (leverage) {
      case 'strong': return <TrendingUp className="h-5 w-5" />;
      case 'moderate': return <ArrowRight className="h-5 w-5" />;
      case 'weak': return <TrendingDown className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Generating negotiation intelligence...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!intelligence) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Contract Negotiation Intelligence
            </CardTitle>
            <Button
              onClick={generateIntelligence}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Negotiation Leverage */}
          <div className={`p-4 rounded-lg border-2 ${getLeverageColor(intelligence.negotiationLeverage)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getLeverageIcon(intelligence.negotiationLeverage)}
              <span className="font-semibold text-lg">
                {intelligence.negotiationLeverage.charAt(0).toUpperCase() + 
                 intelligence.negotiationLeverage.slice(1)} Negotiation Position
              </span>
            </div>
            <p className="text-sm">{intelligence.recommendedStrategy}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-600">Facility Quality</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {intelligence.keyMetrics.facilityQuality.toFixed(1)}
                <span className="text-sm text-gray-500">/5</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-600">Patient Satisfaction</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {intelligence.keyMetrics.patientSatisfaction.toFixed(1)}
                <span className="text-sm text-gray-500">/10</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-gray-600">Payer Rating</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {intelligence.keyMetrics.payerStarRating.toFixed(1)}
                <span className="text-sm text-gray-500">/5</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-xs text-gray-600">Bed Capacity</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {intelligence.keyMetrics.bedCapacity}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Payer Enrollment</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {intelligence.keyMetrics.payerEnrollment.toLocaleString()}
                <span className="text-sm text-gray-500 ml-1">members</span>
              </div>
            </div>
          </div>

          {/* Facility Strengths */}
          {intelligence.facilityStrengths.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Your Negotiation Strengths
              </h4>
              <ul className="space-y-2">
                {intelligence.facilityStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Payer Insights */}
          {intelligence.payerInsights.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Payer Intelligence
              </h4>
              <ul className="space-y-2">
                {intelligence.payerInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">→</span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Actions */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Next Steps
            </h4>
            <ul className="space-y-1 text-sm text-purple-900">
              <li className="flex items-start gap-2">
                <span>1.</span>
                <span>Review quality metrics with negotiation team</span>
              </li>
              <li className="flex items-start gap-2">
                <span>2.</span>
                <span>Prepare data-driven presentation highlighting strengths</span>
              </li>
              <li className="flex items-start gap-2">
                <span>3.</span>
                <span>Research payer's quality improvement goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span>4.</span>
                <span>Consider value-based payment models aligned with your strengths</span>
              </li>
            </ul>
          </div>

          {/* Data Source */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>Powered by MedPact Research Engine</span>
            <span>Real-time CMS & payer data</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
