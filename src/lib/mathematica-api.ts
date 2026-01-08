/**
 * Mathematica Database API Integration - Philadelphia CBSA Dataset
 * 4.7M records covering all practices in Philadelphia CBSA
 */

export interface MathematicaPricingData {
  cptCode: string;
  cptDescription: string;
  payer: string;
  payerType: 'Commercial' | 'Medicare' | 'Medicaid' | 'Other';
  medianRate: number;
  percentile25: number;
  percentile75: number;
  nationalAverage: number;
  regionalAverage: number;
  sampleSize: number;
  lastUpdated: string;
  region?: string;
  recordCount?: number;
}

export interface PricingComparisonData {
  cptCode: string;
  description: string;
  yourRate?: number;
  mathematicaMedian: number;
  federalBenchmark: number;
  variance: number;
  percentile: number;
}

export interface PayerBreakdown {
  payerName: string;
  payerType: string;
  averageRate: number;
  volumePercent: number;
  totalClaims: number;
}

export interface CPTAnalytics {
  cptCode: string;
  description: string;
  totalVolume: number;
  averageReimbursement: number;
  topPayers: PayerBreakdown[];
  priceRange: {
    min: number;
    max: number;
    median: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercent: number;
}

/**
 * Fetch pricing data for a specific CPT code from Philadelphia CBSA dataset (4.7M records)
 */
export async function getMathematicaPricingByCPT(
  cptCode: string,
  payer?: string,
  region?: string
): Promise<MathematicaPricingData[]> {
  try {
    const params = new URLSearchParams({
      cptCode,
      ...(payer && { payer }),
      ...(region && { region }),
    });

    const response = await fetch(`/api/mathematica/pricing?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Mathematica API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching Mathematica pricing data:', error);
    throw error;
  }
}

/**
 * Get comprehensive analytics for multiple CPT codes
 */
export async function getCPTAnalytics(
  cptCodes: string[],
  payer?: string
): Promise<CPTAnalytics[]> {
  try {
    // Fetch data for each CPT code
    const analyticsPromises = cptCodes.map(async (code) => {
      const pricingData = await getMathematicaPricingByCPT(code, payer);
      
      if (!pricingData || pricingData.length === 0) {
        return null;
      }

      // Calculate aggregated analytics
      const rates = pricingData.map(p => p.medianRate);
      const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;

      return {
        cptCode: code,
        description: pricingData[0].cptDescription,
        totalVolume: pricingData.reduce((sum, p) => sum + (p.sampleSize || 0), 0),
        averageReimbursement: avgRate,
        topPayers: pricingData.slice(0, 5).map(p => ({
          payerName: p.payer,
          payerType: p.payerType,
          averageRate: p.medianRate,
          volumePercent: (p.sampleSize / pricingData.reduce((sum, pr) => sum + (pr.sampleSize || 0), 0)) * 100,
          totalClaims: p.sampleSize,
        })),
        priceRange: {
          min: Math.min(...rates),
          max: Math.max(...rates),
          median: rates.sort((a, b) => a - b)[Math.floor(rates.length / 2)],
        },
        trend: 'stable' as const,
        trendPercent: 0,
      };
    });

    const results = await Promise.all(analyticsPromises);
    return results.filter((r): r is CPTAnalytics => r !== null);
  } catch (error) {
    console.error('Error fetching CPT analytics:', error);
    return [];
  }
}

/**
 * Compare pricing across multiple payers for a CPT code
 */
export async function comparePayerPricing(
  cptCode: string,
  payers: string[]
): Promise<PricingComparisonData[]> {
  try {
    const allPricing = await getMathematicaPricingByCPT(cptCode);
    
    return payers.map(payer => {
      const payerData = allPricing.find(p => p.payer.toLowerCase().includes(payer.toLowerCase()));
      
      if (!payerData) {
        return null;
      }

      const federalBenchmark = allPricing.find(p => p.payer === 'Medicare')?.medianRate || payerData.medianRate * 0.8;
      const variance = calculateVariance(payerData.medianRate, payerData.regionalAverage);

      return {
        cptCode,
        description: payerData.cptDescription,
        yourRate: payerData.medianRate,
        mathematicaMedian: payerData.regionalAverage,
        federalBenchmark,
        variance,
        percentile: 50, // Could calculate actual percentile
      };
    }).filter((r): r is PricingComparisonData => r !== null);
  } catch (error) {
    console.error('Error comparing payer pricing:', error);
    return [];
  }
}

/**
 * Get all unique payers in the Philadelphia CBSA dataset
 */
export async function getAvailablePayers(): Promise<string[]> {
  try {
    const response = await fetch('/api/mathematica/payers', {
      cache: 'force-cache', // Cache payer list
    });
    if (!response.ok) throw new Error('Failed to fetch payers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching payers:', error);
    return [
      'Independence Blue Cross',
      'Medicare',
      'Medicaid (PA)',
      'UnitedHealthcare',
      'Aetna',
      'Cigna',
      'Humana',
      'AmeriHealth',
    ];
  }
}

/**
 * Search CPT codes by description
 */
export async function searchCPTCodes(query: string): Promise<Array<{ code: string; description: string }>> {
  const commonCPTs = [
    { code: '99213', description: 'Office visit, established patient, level 3' },
    { code: '99214', description: 'Office visit, established patient, level 4' },
    { code: '99215', description: 'Office visit, established patient, level 5' },
    { code: '99203', description: 'Office visit, new patient, level 3' },
    { code: '99204', description: 'Office visit, new patient, level 4' },
    { code: '99205', description: 'Office visit, new patient, level 5' },
    { code: '99285', description: 'Emergency department visit, high severity' },
    { code: '99284', description: 'Emergency department visit, moderate severity' },
    { code: '70450', description: 'CT head without contrast' },
    { code: '71045', description: 'Chest X-ray, single view' },
    { code: '93000', description: 'Electrocardiogram (ECG)' },
    { code: '80053', description: 'Comprehensive metabolic panel' },
    { code: '85025', description: 'Complete blood count (CBC)' },
  ];

  return commonCPTs.filter(
    cpt => 
      cpt.code.includes(query.toLowerCase()) || 
      cpt.description.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Export utility to format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate variance percentage between two values
 */
export function calculateVariance(value1: number, value2: number): number {
  if (value2 === 0) return 0;
  return ((value1 - value2) / value2) * 100;
}

/**
 * Format large numbers (e.g., 4.7M)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
