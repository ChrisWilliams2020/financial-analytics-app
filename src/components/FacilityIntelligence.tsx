/**
 * Facility Intelligence Component
 * Integrates MedPact Research Engine data with Price Transparency Analytics
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import MedPactResearchClient from '@/lib/medpact-research-client';

interface FacilityIntelligenceProps {
  cmsCertification?: string;
  facilityName?: string;
  tin?: string;
}

interface FacilityData {
  cms_certification_number: string;
  facility_name: string;
  address: string;
  phone: string;
  bed_count: number;
  ownership_type: string;
  overall_quality_rating: number;
  hcahps_communication_with_nurses: number;
  hcahps_communication_with_doctors: number;
  hcahps_hospital_cleanliness: number;
  hcahps_quietness: number;
  hcahps_overall_rating: number;
  source: string;
  confidence: number;
  last_updated: string;
}

export function FacilityIntelligence({ 
  cmsCertification, 
  facilityName,
  tin 
}: FacilityIntelligenceProps) {
  const [data, setData] = useState<FacilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilityData = async () => {
    if (!cmsCertification) {
      setError('No CMS certification number provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new MedPactResearchClient('http://localhost:3001');
      const result = await client.searchFacility(cmsCertification);
      
      if (result.success) {
        setData(result.data as FacilityData);
      } else {
        setError('Failed to fetch facility data');
      }
    } catch (err) {
      console.error('Error fetching facility intelligence:', err);
      setError('Research Engine API not available. Start the API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cmsCertification) {
      fetchFacilityData();
    }
  }, [cmsCertification]);

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading facility intelligence...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
          {!cmsCertification && (
            <p className="text-xs text-yellow-600 mt-2">
              Add CMS certification number to view facility intelligence
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const getQualityBadgeColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreColor = (score: number, max: number = 10) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Facility Intelligence
            <Badge variant="outline" className="ml-2 text-xs">
              Research Engine
            </Badge>
          </CardTitle>
          <Button
            onClick={fetchFacilityData}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CMS Quality Rating */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">CMS Quality Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{data.overall_quality_rating}</span>
              <span className="text-gray-500">/5</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= data.overall_quality_rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getQualityBadgeColor(data.overall_quality_rating)}>
              {data.overall_quality_rating >= 4 ? 'Excellent' : 
               data.overall_quality_rating >= 3 ? 'Good' : 'Fair'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Confidence: {(data.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>

        {/* HCAHPS Patient Satisfaction */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Patient Satisfaction</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(data.hcahps_overall_rating)}`}>
                {data.hcahps_overall_rating}
              </span>
              <span className="text-gray-500">/10</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Communication with Nurses</span>
              <span className={`font-semibold ${getScoreColor(data.hcahps_communication_with_nurses, 100)}`}>
                {data.hcahps_communication_with_nurses}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Communication with Doctors</span>
              <span className={`font-semibold ${getScoreColor(data.hcahps_communication_with_doctors, 100)}`}>
                {data.hcahps_communication_with_doctors}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Hospital Cleanliness</span>
              <span className={`font-semibold ${getScoreColor(data.hcahps_hospital_cleanliness, 100)}`}>
                {data.hcahps_hospital_cleanliness}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Quietness</span>
              <span className={`font-semibold ${getScoreColor(data.hcahps_quietness, 100)}`}>
                {data.hcahps_quietness}%
              </span>
            </div>
          </div>
        </div>

        {/* Facility Details */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bed Count</span>
              <span className="font-semibold flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.bed_count}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ownership</span>
              <span className="font-semibold text-right max-w-[180px]">
                {data.ownership_type}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Data Source</span>
              <span className="font-semibold">{data.source}</span>
            </div>
          </div>
        </div>

        {/* Data Provenance */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Verified Data</span>
          </div>
          <span>Updated: {new Date(data.last_updated).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
