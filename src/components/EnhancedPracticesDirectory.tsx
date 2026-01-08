/**
 * Enhanced Practices Directory with HCAHPS Patient Satisfaction
 * Enriches facility listings with Research Engine intelligence
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MedPactResearchClient from '@/lib/medpact-research-client';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Star, 
  Users, 
  RefreshCw,
  Search,
  TrendingUp,
  Award
} from 'lucide-react';

interface Practice {
  name: string;
  tin: string;
  type: 'asc' | 'hopd' | 'professional';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  cmsCertification?: string;
}

interface EnhancedPractice extends Practice {
  intelligence?: {
    qualityRating: number;
    patientSatisfaction: number;
    bedCount: number;
    hcahpsNurses: number;
    hcahpsDoctors: number;
    hcahpsCleanliness: number;
    confidence: number;
    lastUpdated: string;
  };
  loading?: boolean;
}

export function EnhancedPracticesDirectory({ 
  practices: initialPractices 
}: { 
  practices: Practice[] 
}) {
  const [practices, setPractices] = useState<EnhancedPractice[]>(
    initialPractices.map(p => ({ ...p }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAll, setLoadingAll] = useState(false);

  const enrichPractice = async (practice: EnhancedPractice): Promise<EnhancedPractice> => {
    if (!practice.cmsCertification) {
      return practice;
    }

    try {
      const client = new MedPactResearchClient('http://localhost:3001');
      const result = await client.searchFacility(practice.cmsCertification);

      if (result.success && result.data) {
        return {
          ...practice,
          intelligence: {
            qualityRating: result.data.overall_quality_rating,
            patientSatisfaction: result.data.hcahps_overall_rating,
            bedCount: result.data.bed_count,
            hcahpsNurses: result.data.hcahps_communication_with_nurses,
            hcahpsDoctors: result.data.hcahps_communication_with_doctors,
            hcahpsCleanliness: result.data.hcahps_hospital_cleanliness,
            confidence: result.data.confidence,
            lastUpdated: result.data.last_updated
          }
        };
      }
    } catch (error) {
      console.error('Error enriching practice:', error);
    }

    return practice;
  };

  const enrichAll = async () => {
    setLoadingAll(true);
    
    const enriched = await Promise.all(
      practices.map(practice => enrichPractice(practice))
    );
    
    setPractices(enriched);
    setLoadingAll(false);
  };

  const filteredPractices = practices.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tin.includes(searchTerm)
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'asc': return 'bg-blue-100 text-blue-700';
      case 'hopd': return 'bg-green-100 text-green-700';
      case 'professional': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'asc': return 'ASC';
      case 'hopd': return 'HOPD';
      case 'professional': return 'Professional';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Practices Directory
              <span className="text-sm font-normal text-gray-500">
                ({filteredPractices.length} facilities)
              </span>
            </CardTitle>
            <Button 
              onClick={enrichAll} 
              disabled={loadingAll}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loadingAll ? 'animate-spin' : ''}`} />
              {loadingAll ? 'Enriching...' : 'Enrich All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, city, or TIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredPractices.map((practice, idx) => (
              <Card key={idx} className="border border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    {/* Left: Practice Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{practice.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(practice.type)}`}>
                          {getTypeLabel(practice.type)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{practice.address}, {practice.city}, {practice.state} {practice.zip}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{practice.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>TIN: {practice.tin}</span>
                          {practice.cmsCertification && (
                            <span className="ml-2">CMS: {practice.cmsCertification}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Intelligence Card */}
                    {practice.intelligence && (
                      <div className="ml-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-900">Intelligence Data</span>
                        </div>
                        
                        <div className="space-y-2">
                          {/* Quality Rating */}
                          <div className="bg-white rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">CMS Quality</span>
                              <div className="flex items-center gap-1">
                                <span className="font-bold">{practice.intelligence.qualityRating}</span>
                                <span className="text-xs text-gray-500">/5</span>
                                <div className="flex ml-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= practice.intelligence!.qualityRating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Patient Satisfaction */}
                          <div className="bg-white rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Patient Satisfaction</span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="font-bold text-green-600">
                                  {practice.intelligence.patientSatisfaction}
                                </span>
                                <span className="text-xs text-gray-500">/10</span>
                              </div>
                            </div>
                            <div className="space-y-1 mt-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Nurses</span>
                                <span className="font-semibold">{practice.intelligence.hcahpsNurses}%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Doctors</span>
                                <span className="font-semibold">{practice.intelligence.hcahpsDoctors}%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Cleanliness</span>
                                <span className="font-semibold">{practice.intelligence.hcahpsCleanliness}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Bed Count */}
                          <div className="bg-white rounded p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Capacity</span>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-gray-500" />
                                <span className="font-semibold">{practice.intelligence.bedCount}</span>
                                <span className="text-xs text-gray-500">beds</span>
                              </div>
                            </div>
                          </div>

                          {/* Data Source */}
                          <div className="text-xs text-gray-500 pt-1 border-t flex justify-between">
                            <span>Confidence: {(practice.intelligence.confidence * 100).toFixed(0)}%</span>
                            <span>{new Date(practice.intelligence.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No Intelligence Available */}
                    {!practice.intelligence && practice.cmsCertification && (
                      <div className="ml-4 bg-gray-50 rounded-lg p-4 min-w-[200px] flex items-center justify-center">
                        <Button 
                          onClick={async () => {
                            const enriched = await enrichPractice(practice);
                            setPractices(prev => 
                              prev.map(p => p.tin === practice.tin ? enriched : p)
                            );
                          }}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Load Intelligence
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPractices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No practices found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
