/**
 * MedPact Research Engine - TypeScript Client Library
 * Easy integration for all MedPact applications
 */

export interface EntityIdentifiers {
  cms_certification?: string;
  fda_510k?: string;
  ndc?: string;
  system_name?: string;
  contract_number?: string;
  [key: string]: string | undefined;
}

export type EntityType = 'facility' | 'medical_device' | 'pharmaceutical' | 'health_system' | 'payer';
export type SearchScope = 'PUBLIC_ONLY' | 'INCLUDE_WEBSITES' | 'INCLUDE_SOCIAL' | 'INCLUDE_OPEN_AUG' | 'FULL_SEARCH';
export type ExportFormat = 'json' | 'csv' | 'medpact';

export interface SearchRequest {
  entityType: EntityType;
  identifiers: EntityIdentifiers;
  scope?: SearchScope;
}

export interface SearchResponse {
  success: boolean;
  entity_id: string;
  status: string;
  data: Record<string, any>;
  metadata: {
    total_fields: number;
    search_scope: string;
    timestamp: string;
  };
}

export interface Entity {
  id: string;
  entity_type: EntityType;
  identifiers: EntityIdentifiers;
  created_at: string;
  updated_at?: string;
  data: Record<string, any>;
}

export interface ListEntitiesResponse {
  success: boolean;
  count: number;
  entities: Entity[];
}

export interface RefreshResponse {
  success: boolean;
  entity_id: string;
  updated_at: string;
  fields_updated: number;
}

export interface StatsResponse {
  total_entities: number;
  total_searches: number;
  entities_by_type: Record<string, number>;
  recent_searches: Array<{
    entityId: string;
    timestamp: string;
    scope: string;
  }>;
}

/**
 * MedPact Research Engine Client
 */
export class MedPactResearchClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string = 'http://localhost:3001', apiKey?: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      this.headers['Authorization'] = `Bearer ${apiKey}`;
    }
  }

  /**
   * Search for an entity
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const response = await fetch(`${this.baseURL}/api/search`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get entity by ID
   */
  async getEntity(entityId: string): Promise<Entity> {
    const response = await fetch(
      `${this.baseURL}/api/entities/${encodeURIComponent(entityId)}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Get entity failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.entity;
  }

  /**
   * List all entities with optional filtering
   */
  async listEntities(type?: EntityType, limit: number = 50): Promise<ListEntitiesResponse> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', limit.toString());

    const response = await fetch(
      `${this.baseURL}/api/entities?${params}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`List entities failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Refresh entity data
   */
  async refresh(entityId: string): Promise<RefreshResponse> {
    const response = await fetch(
      `${this.baseURL}/api/refresh/${encodeURIComponent(entityId)}`,
      {
        method: 'POST',
        headers: this.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Export entity data
   */
  async export(entityId: string, format: ExportFormat = 'medpact'): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/api/export/${encodeURIComponent(entityId)}/${format}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return format === 'csv' ? await response.text() : await response.json();
  }

  /**
   * Get API statistics
   */
  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${this.baseURL}/api/stats`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Get stats failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // ========================================================================
  // Convenience Methods for Specific Entity Types
  // ========================================================================

  /**
   * Search for a facility by CMS certification number
   */
  async searchFacility(cmsCertification: string, scope?: SearchScope): Promise<SearchResponse> {
    return this.search({
      entityType: 'facility',
      identifiers: { cms_certification: cmsCertification },
      scope,
    });
  }

  /**
   * Search for a medical device by FDA 510(k) number
   */
  async searchMedicalDevice(fda510k: string, scope?: SearchScope): Promise<SearchResponse> {
    return this.search({
      entityType: 'medical_device',
      identifiers: { fda_510k: fda510k },
      scope,
    });
  }

  /**
   * Search for a pharmaceutical by NDC code
   */
  async searchPharmaceutical(ndc: string, scope?: SearchScope): Promise<SearchResponse> {
    return this.search({
      entityType: 'pharmaceutical',
      identifiers: { ndc },
      scope,
    });
  }

  /**
   * Search for a health system by name
   */
  async searchHealthSystem(systemName: string, scope?: SearchScope): Promise<SearchResponse> {
    return this.search({
      entityType: 'health_system',
      identifiers: { system_name: systemName },
      scope,
    });
  }

  /**
   * Search for a payer by contract number
   */
  async searchPayer(contractNumber: string, scope?: SearchScope): Promise<SearchResponse> {
    return this.search({
      entityType: 'payer',
      identifiers: { contract_number: contractNumber },
      scope,
    });
  }

  /**
   * Get all facilities
   */
  async getAllFacilities(limit: number = 50): Promise<Entity[]> {
    const response = await this.listEntities('facility', limit);
    return response.entities;
  }

  /**
   * Get all payers
   */
  async getAllPayers(limit: number = 50): Promise<Entity[]> {
    const response = await this.listEntities('payer', limit);
    return response.entities;
  }
}

// ========================================================================
// React Hooks for Next.js Integration
// ========================================================================

/**
 * React hook for searching entities
 * 
 * @example
 * const { data, loading, error, search } = useEntitySearch();
 * 
 * // Search for a facility
 * await search('facility', { cms_certification: '390200' });
 */
export function useEntitySearch() {
  const client = new MedPactResearchClient();
  
  return {
    async search(entityType: EntityType, identifiers: EntityIdentifiers, scope?: SearchScope) {
      return await client.search({ entityType, identifiers, scope });
    },
    
    async searchFacility(cmsCertification: string) {
      return await client.searchFacility(cmsCertification);
    },
    
    async searchPayer(contractNumber: string) {
      return await client.searchPayer(contractNumber);
    },
  };
}

/**
 * React hook for entity data
 * 
 * @example
 * const { entity, loading, error, refresh } = useEntity(entityId);
 */
export function useEntity(entityId: string) {
  const client = new MedPactResearchClient();
  
  return {
    async get() {
      return await client.getEntity(entityId);
    },
    
    async refresh() {
      return await client.refresh(entityId);
    },
    
    async export(format: ExportFormat = 'medpact') {
      return await client.export(entityId, format);
    },
  };
}

// ========================================================================
// Default Export
// ========================================================================

export default MedPactResearchClient;

// ========================================================================
// Usage Examples
// ========================================================================

/*

// Example 1: Basic client usage
const client = new MedPactResearchClient();

const facility = await client.searchFacility('390200');
console.log(facility.data.facility_name); // "Penn Presbyterian Medical Center"

// Example 2: Search multiple entity types
const client = new MedPactResearchClient('http://localhost:3001');

const results = await Promise.all([
  client.searchFacility('390200'),
  client.searchPayer('H1234'),
  client.searchPharmaceutical('0006-3060'),
]);

// Example 3: Export data for integration
const entity = await client.searchFacility('390200');
const medpactFormat = await client.export(entity.entity_id, 'medpact');

// Example 4: Get statistics
const stats = await client.getStats();
console.log(`Total entities: ${stats.total_entities}`);

// Example 5: In Next.js component
'use client';

import { useState, useEffect } from 'react';
import MedPactResearchClient from '@/lib/medpact-research-client';

export default function FacilityIntelligence({ cmsCertification }: { cmsCertification: string }) {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new MedPactResearchClient();
    
    client.searchFacility(cmsCertification).then(result => {
      setFacility(result.data);
      setLoading(false);
    });
  }, [cmsCertification]);

  if (loading) return <div>Loading facility intelligence...</div>;

  return (
    <div>
      <h2>{facility.facility_name}</h2>
      <p>Quality Rating: {facility.overall_quality_rating}/5</p>
      <p>Patient Satisfaction: {facility.hcahps_overall_rating}/10</p>
      <p>Bed Count: {facility.bed_count}</p>
    </div>
  );
}

*/
