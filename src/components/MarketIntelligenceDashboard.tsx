/**
 * Market Intelligence Dashboard
 * Cross-references facility and payer data from Research Engine
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MedPactResearchClient from '@/lib/medpact-research-client';
import {
  TrendingUp,
  Building2,
  Shield,
  Star,
  Users,
  DollarSign,
  Award,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface FacilityIntelligence {
  id: string;
  name: string;
  qualityRating: number;
  patientSatisfaction: number;
  bedCount: number;
}

interface PayerIntelligence {
  id: string;
  planName: string;
  starRating: number;
  enrollment: number;
  serviceArea: string;
}

export function MarketIntelligenceDashboard({
  facilityCertifications,
  payerContracts
}: {
  facilityCertifications?: string[];
  payerContracts?: string[];
}) {
  const [facilities, setFacilities] = useState<FacilityIntelligence[]>([]);
  const [payers, setPayers] = useState<PayerIntelligence[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const loadIntelligence = async () => {
    setLoading(true);
    const client = new MedPactResearchClient('http://localhost:3001');

    try {
      // Load facility intelligence
      if (facilityCertifications && facilityCertifications.length > 0) {
        const facilityData = await Promise.all(
          facilityCertifications.map(async (cert) => {
            try {
              const result = await client.searchFacility(cert);
              if (result.success) {
                return {
                  id: cert,
                  name: result.data.facility_name,
                  qualityRating: result.data.overall_quality_rating,
                  patientSatisfaction: result.data.hcahps_overall_rating,
                  bedCount: result.data.bed_count
                };
              }
            } catch (error) {
              console.error(`Error loading facility ${cert}:`, error);
            }
            return null;
          })
        );
        setFacilities(facilityData.filter(Boolean) as FacilityIntelligence[]);
      }

      // Load payer intelligence
      if (payerContracts && payerContracts.length > 0) {
        const payerData = await Promise.all(
          payerContracts.map(async (contract) => {
            try {
              const result = await client.searchPayer(contract);
              if (result.success) {
                return {
                  id: contract,
                  planName: result.data.plan_name,
                  starRating: result.data.overall_star_rating,
                  enrollment: result.data.enrollment_count,
                  serviceArea: result.data.service_area
                };
              }
            } catch (error) {
              console.error(`Error loading payer ${contract}:`, error);
            }
            return null;
          })
        );
        setPayers(payerData.filter(Boolean) as PayerIntelligence[]);
      }

      // Load API stats
      const apiStats = await client.getStats();
      setStats(apiStats);

    } catch (error) {
      console.error('Error loading market intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((facilityCertifications && facilityCertifications.length > 0) ||
        (payerContracts && payerContracts.length > 0)) {
      loadIntelligence();
    }
  }, []);

  const averageQuality = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + f.qualityRating, 0) / facilities.length
    : 0;

  const averagePayerStars = payers.length > 0
    ? payers.reduce((sum, p) => sum + p.starRating, 0) / payers.length
    : 0;

  const totalBeds = facilities.reduce((sum, f) => sum + f.bedCount, 0);
  const totalEnrollment = payers.reduce((sum, p) => sum + p.enrollment, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Market Intelligence Dashboard
            </CardTitle>
            <Button 
              onClick={loadIntelligence}
              disabled={loading}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Facilities Summary */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Facilities Tracked</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{facilities.length}</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{totalBeds.toLocaleString()} total beds</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Quality */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Avg Quality Rating</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-green-900">
                {averageQuality.toFixed(1)}
              </span>
              <span className="text-gray-500">/5.0</span>
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageQuality)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payers Summary */}
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Payers Tracked</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-900">{payers.length}</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{totalEnrollment.toLocaleString()} members</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Payer Stars */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Avg Payer Stars</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-yellow-900">
                {averagePayerStars.toFixed(1)}
              </span>
              <span className="text-gray-500">/5.0</span>
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averagePayerStars)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facilities List */}
      {facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facility Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilities.map((facility) => (
                <div 
                  key={facility.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{facility.name}</h4>
                    <p className="text-sm text-gray-500">CMS: {facility.id}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Quality</div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-green-600">{facility.qualityRating}</span>
                        <span className="text-xs text-gray-400">/5</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Satisfaction</div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-blue-600">{facility.patientSatisfaction}</span>
                        <span className="text-xs text-gray-400">/10</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Beds</div>
                      <div className="font-bold text-gray-900">{facility.bedCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payers List */}
      {payers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Payer Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payers.map((payer) => (
                <div 
                  key={payer.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{payer.planName}</h4>
                    <p className="text-sm text-gray-500">{payer.serviceArea}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Star Rating</div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-yellow-600">{payer.starRating}</span>
                        <span className="text-xs text-gray-400">/5</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Enrollment</div>
                      <div className="font-bold text-gray-900">{payer.enrollment.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {facilities.length === 0 && payers.length === 0 && !loading && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">No intelligence data loaded</span>
            </div>
            <p className="text-sm text-yellow-600 mt-2">
              Add facility certifications and payer contracts to view market intelligence.
            </p>
          </CardContent>
        </Card>
      )}

      {/* API Stats */}
      {stats && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Research Engine Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Total Entities</div>
                <div className="font-semibold text-lg">{stats.total_entities}</div>
              </div>
              <div>
                <div className="text-gray-500">Total Searches</div>
                <div className="font-semibold text-lg">{stats.total_searches}</div>
              </div>
              <div>
                <div className="text-gray-500">Entity Types</div>
                <div className="font-semibold text-lg">
                  {Object.keys(stats.entities_by_type || {}).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
