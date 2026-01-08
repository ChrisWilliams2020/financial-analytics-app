/**
 * MedPact Research Engine Client
 * For Financial Analytics App
 */

const API_URL = process.env.NEXT_PUBLIC_RESEARCH_ENGINE_URL || 'http://localhost:3001';
const API_KEY = process.env.RESEARCH_ENGINE_API_KEY || '';

export interface SearchParams {
  entityType: 'facility' | 'provider' | 'pharmaceutical' | 'medical_device';
  identifiers: {
    npi?: string;
    cms_certification?: string;
    tin?: string;
  };
  searchScope?: 'basic' | 'standard' | 'comprehensive';
  includeTiers?: string[];
}

export interface SearchResult {
  entity: {
    id: string;
    entity_type: string;
    identifiers: Record<string, string>;
    created_at: string;
  };
  data: {
    tier_1_public?: any;
    tier_2_websites?: any;
    tier_3_social?: any;
    tier_5_enterprise?: any; // Mathematica data
  };
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalRecords: number;
    duration: number;
  };
}

export interface MathematicaPricing {
  pricing?: {
    average_allowed_amount?: number;
    median_allowed_amount?: number;
    percentile_25?: number;
    percentile_75?: number;
    percentile_90?: number;
    sample_size?: number;
  };
  benchmarks?: {
    national_average?: number;
    regional_average?: number;
    peer_group_average?: number;
    quality_adjusted_price?: number;
  };
  market_intelligence?: {
    market_share?: number;
    competition_index?: number;
    price_transparency_score?: number;
    utilization_trends?: any[];
  };
}

class ResearchEngineClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_URL;
    this.apiKey = API_KEY;

    if (!this.apiKey) {
      console.warn('⚠️  Research Engine API key not configured');
    }
  }

  /**
   * Search for entity data
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const response = await fetch(`${this.baseUrl}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Search failed');
    }

    return response.json();
  }

  /**
   * Get Mathematica pricing data for a facility/provider
   */
  async getMathematicaPricing(npi: string): Promise<MathematicaPricing | null> {
    try {
      const result = await this.search({
        entityType: 'facility',
        identifiers: { npi },
        searchScope: 'comprehensive',
        includeTiers: ['tier_5_enterprise'],
      });

      // Extract Mathematica data from tier_5_enterprise
      const mathematicaData = result.data.tier_5_enterprise?.mathematica_pricing;
      return mathematicaData || null;
    } catch (error) {
      console.error('Failed to get Mathematica pricing:', error);
      return null;
    }
  }

  /**
   * Get procedure pricing data
   */
  async getProcedurePricing(params: {
    procedure_codes: string[];
    npi?: string;
    geographic_area?: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/mathematica/procedures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to get procedure pricing');
    }

    return response.json();
  }

  /**
   * Get market intelligence data
   */
  async getMarketIntelligence(params: {
    npi?: string;
    market_area?: string;
    service_lines?: string[];
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/mathematica/market`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to get market intelligence');
    }

    return response.json();
  }

  /**
   * Get entity by ID
   */
  async getEntity(entityId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/entities/${entityId}`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Entity not found');
    }

    return response.json();
  }

  /**
   * Get all entities
   */
  async getAllEntities(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/entities`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get entities');
    }

    const data = await response.json();
    return data.entities || [];
  }

  /**
   * Get API statistics
   */
  async getStats(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/stats`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get stats');
    }

    return response.json();
  }
}

// Export singleton instance
export const researchEngine = new ResearchEngineClient();

// Export class for testing
export { ResearchEngineClient };
