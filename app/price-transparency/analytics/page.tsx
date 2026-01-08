"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageHeader from "@/components/StageHeader";
import { PricingChart } from "@/components/PricingChart";
import { formatCurrency, formatLargeNumber } from "@/lib/mathematica-api";
import { Search, TrendingUp, Building2, DollarSign, Home, Stethoscope, Split, Building, MapPin, Users, Phone, Star, Award, FileText } from "lucide-react";
import Link from "next/link";

interface TINData {
  tin: string;
  providerName: string;
  totalVolume: number;
  averageRate: number;
  medianRate: number;
  claimCount: number;
  region: string;
  type: 'asc' | 'hopd' | 'professional';
}

interface HealthScore {
  overall: number;
  patientSatisfaction: number;
  clinicalOutcomes: number;
  safetyRecord: number;
  lastUpdated: string;
}

interface Practice {
  name: string;
  tin: string;
  type: 'asc' | 'hopd' | 'professional';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  healthScore: HealthScore;
  acceptedPayers: string[];
  physicians: {
    name: string;
    specialty: string;
    npi: string;
    healthScore: HealthScore;
    acceptedPayers: string[];
  }[];
}

type ViewMode = 'all' | 'asc' | 'hopd' | 'professional';

export default function PriceTransparencyAnalytics() {
  const [cptCode, setCptCode] = useState("66984");
  const [loading, setLoading] = useState(false);
  const [allTinData, setAllTinData] = useState<TINData[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showPractices, setShowPractices] = useState(false);
  const [showHealthScores, setShowHealthScores] = useState(false);
  const [showPayerPlans, setShowPayerPlans] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [region] = useState("Philadelphia CBSA");

  useEffect(() => {
    if (cptCode === "66984") {
      handleSearch();
    }
  }, []);

  const generateHealthScore = (base: number): HealthScore => {
    const variance = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
    const overall = Math.min(5, Math.max(3, base + variance));
    return {
      overall: parseFloat(overall.toFixed(1)),
      patientSatisfaction: parseFloat((overall + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      clinicalOutcomes: parseFloat((overall + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      safetyRecord: parseFloat((overall + (Math.random() * 0.3 - 0.15)).toFixed(1)),
      lastUpdated: "December 2025"
    };
  };

  const philadelphiaPayers = [
    "Independence Blue Cross",
    "Aetna",
    "UnitedHealthcare",
    "Cigna",
    "Humana",
    "Medicare",
    "Medicaid (PA)",
    "Horizon BCBS",
    "AmeriHealth",
    "Kaiser Permanente",
    "Highmark",
    "Oscar Health"
  ];

  const getRandomPayers = (min: number, max: number): string[] => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...philadelphiaPayers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const generateMockPractices = (): Practice[] => {
    const practiceData: Practice[] = [
      {
        name: "Wills Eye Surgery Center",
        tin: "20-0000001",
        type: "asc",
        address: "840 Walnut Street, Suite 1020",
        city: "Philadelphia",
        state: "PA",
        zip: "19107",
        phone: "(215) 928-3000",
        healthScore: generateHealthScore(4.5),
        acceptedPayers: getRandomPayers(8, 12),
        physicians: [
          { 
            name: "Dr. Sarah Mitchell", 
            specialty: "Ophthalmology - Cataract/Anterior Segment", 
            npi: "1234567890",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(6, 10)
          },
          { 
            name: "Dr. James Chen", 
            specialty: "Ophthalmology - Retina", 
            npi: "1234567891",
            healthScore: generateHealthScore(4.7),
            acceptedPayers: getRandomPayers(7, 11)
          },
          { 
            name: "Dr. Rebecca Taylor", 
            specialty: "Ophthalmology - Glaucoma", 
            npi: "1234567892",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(6, 9)
          }
        ]
      },
      {
        name: "Penn Medicine Ambulatory Surgery",
        tin: "20-0000002",
        type: "asc",
        address: "3400 Spruce Street",
        city: "Philadelphia",
        state: "PA",
        zip: "19104",
        phone: "(215) 662-8000",
        healthScore: generateHealthScore(4.7),
        acceptedPayers: getRandomPayers(9, 12),
        physicians: [
          { 
            name: "Dr. Michael Johnson", 
            specialty: "Ophthalmology - Comprehensive", 
            npi: "1234567893",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(8, 11)
          },
          { 
            name: "Dr. Lisa Anderson", 
            specialty: "Ophthalmology - Pediatric", 
            npi: "1234567894",
            healthScore: generateHealthScore(4.8),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Jefferson Outpatient Surgery Center",
        tin: "20-0000003",
        type: "asc",
        address: "211 S 9th Street",
        city: "Philadelphia",
        state: "PA",
        zip: "19107",
        phone: "(215) 955-6000",
        healthScore: generateHealthScore(4.4),
        acceptedPayers: getRandomPayers(7, 11),
        physicians: [
          { 
            name: "Dr. Robert Williams", 
            specialty: "Ophthalmology - Cornea", 
            npi: "1234567895",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(6, 9)
          },
          { 
            name: "Dr. Emily Davis", 
            specialty: "Ophthalmology - Oculoplastics", 
            npi: "1234567896",
            healthScore: generateHealthScore(4.3),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Wills Eye Hospital - HOPD",
        tin: "25-0000001",
        type: "hopd",
        address: "840 Walnut Street",
        city: "Philadelphia",
        state: "PA",
        zip: "19107",
        phone: "(215) 928-3000",
        healthScore: generateHealthScore(4.6),
        acceptedPayers: getRandomPayers(10, 12),
        physicians: [
          { 
            name: "Dr. William Thompson", 
            specialty: "Ophthalmology - Retina Specialist", 
            npi: "1234567897",
            healthScore: generateHealthScore(4.7),
            acceptedPayers: getRandomPayers(8, 11)
          },
          { 
            name: "Dr. Jennifer Lee", 
            specialty: "Ophthalmology - Neuro-Ophthalmology", 
            npi: "1234567898",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(7, 10)
          },
          { 
            name: "Dr. Christopher Martinez", 
            specialty: "Ophthalmology - Uveitis", 
            npi: "1234567899",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(8, 11)
          }
        ]
      },
      {
        name: "Penn Presbyterian Medical Center - HOPD",
        tin: "25-0000002",
        type: "hopd",
        address: "51 N 39th Street",
        city: "Philadelphia",
        state: "PA",
        zip: "19104",
        phone: "(215) 662-8000",
        healthScore: generateHealthScore(4.5),
        acceptedPayers: getRandomPayers(9, 12),
        physicians: [
          { 
            name: "Dr. David Brown", 
            specialty: "Ophthalmology - Comprehensive", 
            npi: "1234567900",
            healthScore: generateHealthScore(4.4),
            acceptedPayers: getRandomPayers(8, 11)
          },
          { 
            name: "Dr. Michelle Garcia", 
            specialty: "Ophthalmology - Cataract Surgery", 
            npi: "1234567901",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Temple University Hospital - HOPD",
        tin: "25-0000003",
        type: "hopd",
        address: "3401 N Broad Street",
        city: "Philadelphia",
        state: "PA",
        zip: "19140",
        phone: "(215) 707-2000",
        healthScore: generateHealthScore(4.3),
        acceptedPayers: getRandomPayers(8, 11),
        physicians: [
          { 
            name: "Dr. Kevin Rodriguez", 
            specialty: "Ophthalmology - Vitreoretinal Surgery", 
            npi: "1234567902",
            healthScore: generateHealthScore(4.4),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Wills Eye Physicians",
        tin: "30-0000001",
        type: "professional",
        address: "840 Walnut Street, Suite 900",
        city: "Philadelphia",
        state: "PA",
        zip: "19107",
        phone: "(215) 928-3180",
        healthScore: generateHealthScore(4.7),
        acceptedPayers: getRandomPayers(8, 12),
        physicians: [
          { 
            name: "Dr. Thomas Wilson", 
            specialty: "Ophthalmology - Cataract Surgery", 
            npi: "1234567903",
            healthScore: generateHealthScore(4.8),
            acceptedPayers: getRandomPayers(7, 11)
          },
          { 
            name: "Dr. Amanda Moore", 
            specialty: "Ophthalmology - Refractive Surgery", 
            npi: "1234567904",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(6, 10)
          },
          { 
            name: "Dr. Daniel Taylor", 
            specialty: "Ophthalmology - Glaucoma Specialist", 
            npi: "1234567905",
            healthScore: generateHealthScore(4.7),
            acceptedPayers: getRandomPayers(8, 11)
          },
          { 
            name: "Dr. Patricia Anderson", 
            specialty: "Ophthalmology - Pediatric", 
            npi: "1234567906",
            healthScore: generateHealthScore(4.9),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Penn Medicine - Ophthalmology Group",
        tin: "30-0000002",
        type: "professional",
        address: "51 N 39th Street, 1st Floor",
        city: "Philadelphia",
        state: "PA",
        zip: "19104",
        phone: "(215) 662-8100",
        healthScore: generateHealthScore(4.6),
        acceptedPayers: getRandomPayers(9, 12),
        physicians: [
          { 
            name: "Dr. Steven Jackson", 
            specialty: "Ophthalmology - Cornea & External Disease", 
            npi: "1234567907",
            healthScore: generateHealthScore(4.7),
            acceptedPayers: getRandomPayers(8, 11)
          },
          { 
            name: "Dr. Karen White", 
            specialty: "Ophthalmology - Retina Specialist", 
            npi: "1234567908",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(7, 10)
          },
          { 
            name: "Dr. Mark Harris", 
            specialty: "Ophthalmology - Comprehensive", 
            npi: "1234567909",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(8, 11)
          }
        ]
      },
      {
        name: "Jefferson Eye Care Associates",
        tin: "30-0000003",
        type: "professional",
        address: "925 Chestnut Street, Mezzanine Level",
        city: "Philadelphia",
        state: "PA",
        zip: "19107",
        phone: "(215) 928-3350",
        healthScore: generateHealthScore(4.4),
        acceptedPayers: getRandomPayers(7, 10),
        physicians: [
          { 
            name: "Dr. Brian Martin", 
            specialty: "Ophthalmology - Cataract & Refractive", 
            npi: "1234567910",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(6, 9)
          },
          { 
            name: "Dr. Nancy Thompson", 
            specialty: "Ophthalmology - Glaucoma", 
            npi: "1234567911",
            healthScore: generateHealthScore(4.3),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Main Line Surgical Associates",
        tin: "20-0000004",
        type: "asc",
        address: "100 Lancaster Avenue",
        city: "Wynnewood",
        state: "PA",
        zip: "19096",
        phone: "(610) 645-2000",
        healthScore: generateHealthScore(4.5),
        acceptedPayers: getRandomPayers(7, 11),
        physicians: [
          { 
            name: "Dr. Gregory Lewis", 
            specialty: "Ophthalmology - Anterior Segment", 
            npi: "1234567912",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(6, 10)
          },
          { 
            name: "Dr. Susan Walker", 
            specialty: "Ophthalmology - Comprehensive", 
            npi: "1234567913",
            healthScore: generateHealthScore(4.4),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Delaware Valley Surgery Center",
        tin: "20-0000005",
        type: "asc",
        address: "955 West State Street",
        city: "Doylestown",
        state: "PA",
        zip: "18901",
        phone: "(215) 345-2000",
        healthScore: generateHealthScore(4.3),
        acceptedPayers: getRandomPayers(6, 9),
        physicians: [
          { 
            name: "Dr. Joseph Hall", 
            specialty: "Ophthalmology - Cataract Surgery", 
            npi: "1234567914",
            healthScore: generateHealthScore(4.4),
            acceptedPayers: getRandomPayers(5, 8)
          }
        ]
      },
      {
        name: "Temple Eye Physicians",
        tin: "30-0000004",
        type: "professional",
        address: "1910 N Broad Street",
        city: "Philadelphia",
        state: "PA",
        zip: "19122",
        phone: "(215) 707-4000",
        healthScore: generateHealthScore(4.4),
        acceptedPayers: getRandomPayers(8, 11),
        physicians: [
          { 
            name: "Dr. Richard Allen", 
            specialty: "Ophthalmology - Oculoplastics", 
            npi: "1234567915",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(7, 10)
          },
          { 
            name: "Dr. Carol Young", 
            specialty: "Ophthalmology - Pediatric Ophthalmology", 
            npi: "1234567916",
            healthScore: generateHealthScore(4.6),
            acceptedPayers: getRandomPayers(6, 9)
          },
          { 
            name: "Dr. Paul King", 
            specialty: "Ophthalmology - Retina", 
            npi: "1234567917",
            healthScore: generateHealthScore(4.3),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      },
      {
        name: "Main Line Retina Consultants",
        tin: "30-0000005",
        type: "professional",
        address: "825 Old Lancaster Road, Suite 204",
        city: "Bryn Mawr",
        state: "PA",
        zip: "19010",
        phone: "(610) 525-9400",
        healthScore: generateHealthScore(4.6),
        acceptedPayers: getRandomPayers(7, 10),
        physicians: [
          { 
            name: "Dr. Edward Wright", 
            specialty: "Ophthalmology - Vitreoretinal Surgery", 
            npi: "1234567918",
            healthScore: generateHealthScore(4.7),
            acceptedPayers: getRandomPayers(6, 9)
          },
          { 
            name: "Dr. Margaret Lopez", 
            specialty: "Ophthalmology - Retina Specialist", 
            npi: "1234567919",
            healthScore: generateHealthScore(4.5),
            acceptedPayers: getRandomPayers(7, 10)
          }
        ]
      }
    ];

    return practiceData;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ascProviders = [
        'Wills Eye Surgery Center',
        'Penn Medicine Ambulatory Surgery',
        'Jefferson Outpatient Surgery Center',
        'Main Line Surgical Associates',
        'Delaware Valley Surgery Center',
        'Philadelphia Eye Surgery Center',
        'Suburban Surgical Center',
      ];

      const hopdProviders = [
        'Wills Eye Hospital - HOPD',
        'Penn Presbyterian Medical Center - HOPD',
        'Temple University Hospital - HOPD',
        'Einstein Medical Center - HOPD',
        'Lankenau Medical Center - HOPD',
        'Chester County Hospital - HOPD',
      ];

      const professionalProviders = [
        'Wills Eye Physicians',
        'Penn Medicine - Ophthalmology Group',
        'Jefferson Eye Care Associates',
        'Temple Eye Physicians',
        'Main Line Retina Consultants',
        'Delaware Valley Eye Surgeons',
        'Pennsylvania Eye Associates',
        'Mid Atlantic Retina Specialists',
        'Philadelphia Eye Consultants',
        'Montgomery Eye Physicians',
      ];

      const mockASCData: TINData[] = ascProviders.map((name, i) => {
        const baseRate = 1200 + (Math.random() * 1000);
        const volume = Math.floor(Math.random() * 600) + 200;
        
        return {
          tin: `20-${String(i + 1).padStart(6, '0')}`,
          providerName: name,
          totalVolume: volume * baseRate,
          averageRate: baseRate + (Math.random() * 200) - 100,
          medianRate: baseRate,
          claimCount: volume,
          region: 'Philadelphia CBSA',
          type: 'asc',
        };
      });

      const mockHOPDData: TINData[] = hopdProviders.map((name, i) => {
        const baseRate = 1800 + (Math.random() * 1200);
        const volume = Math.floor(Math.random() * 500) + 150;
        
        return {
          tin: `25-${String(i + 1).padStart(6, '0')}`,
          providerName: name,
          totalVolume: volume * baseRate,
          averageRate: baseRate + (Math.random() * 250) - 125,
          medianRate: baseRate,
          claimCount: volume,
          region: 'Philadelphia CBSA',
          type: 'hopd',
        };
      });

      const mockProfessionalData: TINData[] = professionalProviders.map((name, i) => {
        const baseRate = 400 + (Math.random() * 550);
        const volume = Math.floor(Math.random() * 400) + 150;
        
        return {
          tin: `30-${String(i + 1).padStart(6, '0')}`,
          providerName: name,
          totalVolume: volume * baseRate,
          averageRate: baseRate + (Math.random() * 150) - 75,
          medianRate: baseRate,
          claimCount: volume,
          region: 'Philadelphia CBSA',
          type: 'professional',
        };
      });

      const combinedData = [...mockASCData, ...mockHOPDData, ...mockProfessionalData]
        .sort((a, b) => b.totalVolume - a.totalVolume);

      setAllTinData(combinedData);
      setPractices(generateMockPractices());
    } catch (error) {
      console.error('Error fetching TIN data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = viewMode === 'all' 
    ? allTinData 
    : allTinData.filter(tin => tin.type === viewMode);

  const filteredPractices = practices.filter(practice => {
    const matchesType = viewMode === 'all' || practice.type === viewMode;
    const matchesSearch = searchTerm === '' || 
      practice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practice.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practice.physicians.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalVolume = filteredData.reduce((sum, tin) => sum + tin.totalVolume, 0);
  const avgRate = filteredData.length > 0 
    ? filteredData.reduce((sum, tin) => sum + tin.averageRate, 0) / filteredData.length 
    : 0;
  const totalClaims = filteredData.reduce((sum, tin) => sum + tin.claimCount, 0);

  const ascData = allTinData.filter(t => t.type === 'asc');
  const hopdData = allTinData.filter(t => t.type === 'hopd');
  const professionalData = allTinData.filter(t => t.type === 'professional');
  const ascVolume = ascData.reduce((sum, tin) => sum + tin.totalVolume, 0);
  const hopdVolume = hopdData.reduce((sum, tin) => sum + tin.totalVolume, 0);
  const professionalVolume = professionalData.reduce((sum, tin) => sum + tin.totalVolume, 0);
  const totalAllVolume = ascVolume + hopdVolume + professionalVolume;

  const getColorByType = (type: string, variant: 'gradient' | 'light') => {
    if (variant === 'gradient') {
      switch(type) {
        case 'asc': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        case 'hopd': return 'bg-gradient-to-r from-purple-500 to-pink-500';
        case 'professional': return 'bg-gradient-to-r from-emerald-500 to-teal-500';
        default: return 'bg-gradient-to-r from-cyan-500 to-blue-500';
      }
    } else {
      switch(type) {
        case 'asc': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
        case 'hopd': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
        case 'professional': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
        default: return 'bg-slate-100 text-slate-700';
      }
    }
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }
    const emptyStars = 5 - Math.ceil(score);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-slate-300" />);
    }
    return stars;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader
          title="Price Transparency Analytics"
          subtitle="Philadelphia CBSA Dataset - 4.7M Records"
        />

        <Card className="rounded-3xl mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="cptCode">CPT Code</Label>
                <Input
                  id="cptCode"
                  type="text"
                  placeholder="e.g., 66984"
                  value={cptCode}
                  onChange={(e) => setCptCode(e.target.value)}
                  className="rounded-2xl mt-2"
                />
                <p className="text-xs text-slate-500 mt-1">
                  66984 = Cataract surgery with IOL
                </p>
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  type="text"
                  value={region}
                  disabled
                  className="rounded-2xl mt-2 bg-slate-100"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 h-11"
              >
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze TINs"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {allTinData.length > 0 && (
          <>
            {/* View Mode Toggle */}
            <Card className="rounded-3xl mb-8 border-2 border-cyan-200 dark:border-cyan-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      <Split className="h-5 w-5 text-cyan-600" />
                      Separate ASC, HOPD & Professional Fees
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Compare Ambulatory Surgery Centers, Hospital Outpatient Departments, and Professional fees
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <Button
                    onClick={() => setViewMode('all')}
                    variant={viewMode === 'all' ? 'default' : 'outline'}
                    className={`rounded-2xl flex items-center gap-2 ${
                      viewMode === 'all' ? 'bg-gradient-to-r from-cyan-600 to-emerald-600' : ''
                    }`}
                  >
                    <Split className="h-4 w-4" />
                    All TINs ({allTinData.length})
                  </Button>
                  
                  <Button
                    onClick={() => setViewMode('asc')}
                    variant={viewMode === 'asc' ? 'default' : 'outline'}
                    className={`rounded-2xl flex items-center gap-2 ${
                      viewMode === 'asc' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    ASC Only ({ascData.length})
                  </Button>
                  
                  <Button
                    onClick={() => setViewMode('hopd')}
                    variant={viewMode === 'hopd' ? 'default' : 'outline'}
                    className={`rounded-2xl flex items-center gap-2 ${
                      viewMode === 'hopd' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    HOPD Only ({hopdData.length})
                  </Button>
                  
                  <Button
                    onClick={() => setViewMode('professional')}
                    variant={viewMode === 'professional' ? 'default' : 'outline'}
                    className={`rounded-2xl flex items-center gap-2 ${
                      viewMode === 'professional' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''
                    }`}
                  >
                    <Stethoscope className="h-4 w-4" />
                    Professional Only ({professionalData.length})
                  </Button>
                </div>

                {/* Directory Control Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowPractices(!showPractices)}
                    variant="outline"
                    className={`rounded-2xl flex items-center gap-2 ${
                      showPractices ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    {showPractices ? 'Hide' : 'View'} Practices Directory ({filteredPractices.length})
                  </Button>

                  {showPractices && (
                    <>
                      <Button
                        onClick={() => setShowHealthScores(!showHealthScores)}
                        variant="outline"
                        className={`rounded-2xl flex items-center gap-2 ${
                          showHealthScores ? 'bg-amber-100 dark:bg-amber-900' : ''
                        }`}
                      >
                        <Award className="h-4 w-4" />
                        {showHealthScores ? 'Hide' : 'Show'} Health Scores
                      </Button>

                      <Button
                        onClick={() => setShowPayerPlans(!showPayerPlans)}
                        variant="outline"
                        className={`rounded-2xl flex items-center gap-2 ${
                          showPayerPlans ? 'bg-emerald-100 dark:bg-emerald-900' : ''
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        {showPayerPlans ? 'Hide' : 'Show'} Payer Plans
                      </Button>
                    </>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Home className="h-3 w-3" /> ASC Total
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(ascVolume)}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {((ascVolume / totalAllVolume) * 100).toFixed(1)}% of total • Avg: {formatCurrency(ascData.length > 0 ? ascData.reduce((sum, t) => sum + t.averageRate, 0) / ascData.length : 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Building className="h-3 w-3" /> HOPD Total
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(hopdVolume)}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {((hopdVolume / totalAllVolume) * 100).toFixed(1)}% of total • Avg: {formatCurrency(hopdData.length > 0 ? hopdData.reduce((sum, t) => sum + t.averageRate, 0) / hopdData.length : 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Stethoscope className="h-3 w-3" /> Professional Total
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(professionalVolume)}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {((professionalVolume / totalAllVolume) * 100).toFixed(1)}% of total • Avg: {formatCurrency(professionalData.length > 0 ? professionalData.reduce((sum, t) => sum + t.averageRate, 0) / professionalData.length : 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practices Directory Section */}
            {showPractices && (
              <Card className="rounded-3xl mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-600" />
                    Practices Directory - Philadelphia CBSA
                  </CardTitle>
                  <div className="mt-4">
                    <Input
                      type="text"
                      placeholder="Search by practice name, city, or physician..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPractices.map((practice, index) => (
                      <Card key={index} className="rounded-2xl border-l-4" style={{
                        borderLeftColor: practice.type === 'asc' ? '#3b82f6' : practice.type === 'hopd' ? '#a855f7' : '#10b981'
                      }}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Practice Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-2 mb-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorByType(practice.type, 'light')}`}>
                                    {practice.type === 'asc' && <><Home className="h-3 w-3" /> ASC</>}
                                    {practice.type === 'hopd' && <><Building className="h-3 w-3" /> HOPD</>}
                                    {practice.type === 'professional' && <><Stethoscope className="h-3 w-3" /> Professional</>}
                                  </span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{practice.name}</h4>
                                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div>{practice.address}</div>
                                      <div>{practice.city}, {practice.state} {practice.zip}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span>{practice.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 font-mono text-xs">
                                    <span className="font-semibold">TIN:</span> {practice.tin}
                                  </div>
                                </div>
                              </div>

                              {/* Facility Health Score */}
                              {showHealthScores && (
                                <div className="ml-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-semibold">Facility Score</span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    {renderStars(practice.healthScore.overall)}
                                    <span className="font-bold text-lg">{practice.healthScore.overall}</span>
                                  </div>
                                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                                    <div>Patient Satisfaction: {practice.healthScore.patientSatisfaction}/5</div>
                                    <div>Clinical Outcomes: {practice.healthScore.clinicalOutcomes}/5</div>
                                    <div>Safety Record: {practice.healthScore.safetyRecord}/5</div>
                                    <div className="text-xs text-slate-500 mt-1">Updated: {practice.healthScore.lastUpdated}</div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Facility Accepted Payers */}
                            {showPayerPlans && (
                              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-emerald-600" />
                                  <span className="text-sm font-semibold">Facility Accepted Payers ({practice.acceptedPayers.length})</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {practice.acceptedPayers.map((payer, pIndex) => (
                                    <span key={pIndex} className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                                      {payer}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Physicians List */}
                            <div>
                              <h5 className="font-semibold mb-3 flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                Physicians ({practice.physicians.length})
                              </h5>
                              <div className="grid md:grid-cols-2 gap-3">
                                {practice.physicians.map((physician, pIndex) => (
                                  <div key={pIndex} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="font-semibold text-sm mb-1">{physician.name}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                      {physician.specialty}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500 font-mono mb-2">
                                      NPI: {physician.npi}
                                    </div>

                                    {/* Physician Health Score */}
                                    {showHealthScores && (
                                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                                        <div className="flex items-center gap-1 mb-1">
                                          {renderStars(physician.healthScore.overall)}
                                          <span className="font-bold text-sm ml-1">{physician.healthScore.overall}</span>
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                          Patient Sat: {physician.healthScore.patientSatisfaction}/5<br/>
                                          Outcomes: {physician.healthScore.clinicalOutcomes}/5
                                        </div>
                                      </div>
                                    )}

                                    {/* Physician Accepted Payers */}
                                    {showPayerPlans && (
                                      <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800">
                                        <div className="text-xs font-semibold mb-1">Accepts ({physician.acceptedPayers.length} plans)</div>
                                        <div className="flex flex-wrap gap-1">
                                          {physician.acceptedPayers.slice(0, 3).map((payer, payerIndex) => (
                                            <span key={payerIndex} className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
                                              {payer.length > 15 ? payer.substring(0, 12) + '...' : payer}
                                            </span>
                                          ))}
                                          {physician.acceptedPayers.length > 3 && (
                                            <span className="text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                                              +{physician.acceptedPayers.length - 3} more
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredPractices.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No practices found matching your search criteria
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Total Providers
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {filteredData.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {viewMode === 'all' ? 'All TINs' : viewMode === 'asc' ? 'ASC Facilities' : viewMode === 'hopd' ? 'HOPD Facilities' : 'Professionals'}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Total Volume
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(totalVolume)}
                  </div>
                  <div className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {formatLargeNumber(totalClaims)} claims
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Average Rate
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(avgRate)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Per claim
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Market Leader
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {filteredData[0]?.providerName.substring(0, 25)}
                  </div>
                  <div className="text-sm text-emerald-600 mt-2">
                    {formatCurrency(filteredData[0]?.totalVolume || 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {viewMode === 'asc' && <Home className="h-5 w-5 text-blue-600" />}
                  {viewMode === 'hopd' && <Building className="h-5 w-5 text-purple-600" />}
                  {viewMode === 'professional' && <Stethoscope className="h-5 w-5 text-emerald-600" />}
                  {viewMode === 'all' && <Building2 className="h-5 w-5 text-cyan-600" />}
                  Top {filteredData.length} {viewMode === 'asc' ? 'ASC' : viewMode === 'hopd' ? 'HOPD' : viewMode === 'professional' ? 'Professional' : 'All'} TINs by Total Volume - CPT {cptCode}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Philadelphia CBSA Region {viewMode === 'all' && '(Blue = ASC, Purple = HOPD, Green = Professional)'}
                </p>
              </CardHeader>
              <CardContent>
                <PricingChart
                  title=""
                  data={filteredData.map(tin => ({
                    label: `${tin.providerName} (${tin.tin})`,
                    value: tin.totalVolume,
                    color: getColorByType(tin.type, 'gradient')
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Average Reimbursement Rate by TIN
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sorted by highest average rate
                </p>
              </CardHeader>
              <CardContent>
                <PricingChart
                  title=""
                  data={[...filteredData]
                    .sort((a, b) => b.averageRate - a.averageRate)
                    .map(tin => ({
                      label: tin.providerName,
                      value: tin.averageRate,
                      color: getColorByType(tin.type, 'gradient')
                    }))}
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Detailed TIN Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Rank</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Provider Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">TIN</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Claims</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Avg Rate</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Total Volume</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Market Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((tin, index) => (
                        <tr
                          key={tin.tin}
                          className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                        >
                          <td className="py-3 px-4 text-sm font-bold text-cyan-600">#{index + 1}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorByType(tin.type, 'light')}`}>
                              {tin.type === 'asc' && <><Home className="h-3 w-3" /> ASC</>}
                              {tin.type === 'hopd' && <><Building className="h-3 w-3" /> HOPD</>}
                              {tin.type === 'professional' && <><Stethoscope className="h-3 w-3" /> Professional</>}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">{tin.providerName}</td>
                          <td className="py-3 px-4 text-sm font-mono text-slate-600">{tin.tin}</td>
                          <td className="py-3 px-4 text-sm text-right">{formatLargeNumber(tin.claimCount)}</td>
                          <td className="py-3 px-4 text-sm text-right font-semibold">{formatCurrency(tin.averageRate)}</td>
                          <td className="py-3 px-4 text-sm text-right font-bold text-emerald-600">{formatCurrency(tin.totalVolume)}</td>
                          <td className="py-3 px-4 text-sm text-right text-slate-600">
                            {((tin.totalVolume / totalVolume) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex gap-4">
              <Link href="/price-transparency">
                <Button variant="outline" className="rounded-2xl">
                  Back to Price Transparency
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-2xl">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </>
        )}

        {allTinData.length === 0 && !loading && (
          <Card className="rounded-3xl">
            <CardContent className="py-16 text-center">
              <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Enter a CPT code and click "Analyze TINs" to view data
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
