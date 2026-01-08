"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageHeader from "@/components/StageHeader";
import { PricingChart } from "@/components/PricingChart";
import { formatCurrency, formatLargeNumber } from "@/lib/mathematica-api";
import { 
  Map, Target, TrendingUp, TrendingDown, PieChart, Users, 
  Activity, DollarSign, MapPin, Circle, AlertCircle, Award,
  Percent, Calendar, BarChart3, LineChart, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import Link from "next/link";

type IntelligenceView = 
  | 'competition-map'
  | 'market-benchmarks'
  | 'volume-share'
  | 'payer-mix'
  | 'referral-network'
  | 'procedure-intel'
  | 'demographics'
  | 'contract-intel';

export default function MarketIntelligence() {
  const [activeView, setActiveView] = useState<IntelligenceView>('competition-map');
  const [radius, setRadius] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 39.9526, lng: -75.1652, name: "Philadelphia Center" });
  const [cptCode, setCptCode] = useState("66984");

  // Mock data generators
  const generateCompetitors = (radiusMiles: number) => {
    const baseCount = radiusMiles === 1 ? 3 : radiusMiles === 5 ? 8 : radiusMiles === 10 ? 15 : radiusMiles === 25 ? 35 : 60;
    return Array.from({ length: baseCount }, (_, i) => ({
      name: `Practice ${i + 1}`,
      distance: (Math.random() * radiusMiles).toFixed(1),
      type: ['ASC', 'HOPD', 'Professional'][Math.floor(Math.random() * 3)],
      avgRate: 1200 + Math.random() * 1500,
      volume: Math.floor(Math.random() * 500) + 50,
      marketShare: ((Math.random() * 15) + 1).toFixed(1)
    }));
  };

  const marketBenchmarks = {
    yourRate: 1650,
    marketMedian: 1580,
    market25th: 1320,
    market75th: 1890,
    market90th: 2150,
    percentile: 58,
    competitivePosition: "Above Median",
    pricingOpportunity: "$270 below 75th percentile"
  };

  const volumeData = [
    { month: "Jul 2024", volume: 245, marketShare: 12.3, growth: 5.2 },
    { month: "Aug 2024", volume: 268, marketShare: 13.1, growth: 9.4 },
    { month: "Sep 2024", volume: 292, marketShare: 13.8, growth: 9.0 },
    { month: "Oct 2024", volume: 285, marketShare: 13.5, growth: -2.4 },
    { month: "Nov 2024", volume: 312, marketShare: 14.2, growth: 9.5 },
    { month: "Dec 2024", volume: 325, marketShare: 14.8, growth: 4.2 }
  ];

  const payerMix = [
    { payer: "Independence Blue Cross", percentage: 28.5, avgRate: 1750, denialRate: 3.2 },
    { payer: "Medicare", percentage: 24.3, avgRate: 1420, denialRate: 2.1 },
    { payer: "UnitedHealthcare", percentage: 18.7, avgRate: 1680, denialRate: 4.5 },
    { payer: "Aetna", percentage: 12.4, avgRate: 1620, denialRate: 3.8 },
    { payer: "Cigna", percentage: 8.2, avgRate: 1590, denialRate: 5.1 },
    { payer: "Medicaid (PA)", percentage: 5.6, avgRate: 980, denialRate: 6.8 },
    { payer: "Other", percentage: 2.3, avgRate: 1450, denialRate: 4.2 }
  ];

  const referralSources = [
    { physician: "Dr. Sarah Chen - Primary Care", specialty: "Internal Medicine", referrals: 145, conversionRate: 87.6, npi: "1234567890" },
    { physician: "Dr. Michael Roberts - Optometry", specialty: "Optometry", referrals: 132, conversionRate: 92.4, npi: "1234567891" },
    { physician: "Dr. Jennifer Lee - Family Medicine", specialty: "Family Medicine", referrals: 118, conversionRate: 84.7, npi: "1234567892" },
    { physician: "Dr. David Thompson - Primary Care", specialty: "Internal Medicine", referrals: 97, conversionRate: 89.2, npi: "1234567893" },
    { physician: "Dr. Amanda Martinez - Optometry", specialty: "Optometry", referrals: 86, conversionRate: 91.8, npi: "1234567894" }
  ];

  const procedureIntel = [
    { cpt: "66984", description: "Cataract Surgery w/ IOL", volume: 325, trend: 4.2, avgRate: 1650, profitMargin: 42.3 },
    { cpt: "66821", description: "YAG Laser Capsulotomy", volume: 156, trend: 12.5, avgRate: 485, profitMargin: 38.7 },
    { cpt: "92004", description: "Comprehensive Eye Exam", volume: 892, trend: -2.1, avgRate: 165, profitMargin: 28.4 },
    { cpt: "67228", description: "Retinal Laser Treatment", volume: 78, trend: 8.9, avgRate: 1240, profitMargin: 45.2 },
    { cpt: "65855", description: "Trabeculoplasty", volume: 64, trend: 15.3, avgRate: 890, profitMargin: 41.8 }
  ];

  const demographics = {
    avgAge: 68.4,
    ageDistribution: [
      { range: "18-44", percentage: 8.2 },
      { range: "45-54", percentage: 12.5 },
      { range: "55-64", percentage: 28.7 },
      { range: "65-74", percentage: 35.4 },
      { range: "75+", percentage: 15.2 }
    ],
    comorbidities: [
      { condition: "Diabetes", percentage: 32.4 },
      { condition: "Hypertension", percentage: 58.7 },
      { condition: "Glaucoma", percentage: 18.9 }
    ],
    outcomes: {
      readmissionRate: 1.8,
      avgLOS: 0.5,
      patientSatisfaction: 4.7,
      complicationRate: 2.1
    }
  };

  const contractIntel = [
    { payer: "Independence Blue Cross", currentRate: 1750, marketMedian: 1820, opportunity: "+$70", recommendation: "Negotiate 4-5% increase", priority: "High" },
    { payer: "UnitedHealthcare", currentRate: 1680, marketMedian: 1590, opportunity: "$0", recommendation: "Maintain current rates", priority: "Low" },
    { payer: "Aetna", currentRate: 1620, marketMedian: 1740, opportunity: "+$120", recommendation: "Negotiate 7-8% increase", priority: "High" },
    { payer: "Medicare", currentRate: 1420, marketMedian: 1420, opportunity: "$0", recommendation: "Government rate - monitor changes", priority: "Medium" },
    { payer: "Cigna", currentRate: 1590, marketMedian: 1680, opportunity: "+$90", recommendation: "Negotiate 5-6% increase", priority: "Medium" }
  ];

  const competitors = generateCompetitors(radius);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader
          title="Market Intelligence Dashboard"
          subtitle="Comprehensive Market Analysis & Competitive Positioning"
        />

        {/* Intelligence View Selector */}
        <Card className="rounded-3xl mb-8 border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Select Intelligence View</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => setActiveView('competition-map')}
                variant={activeView === 'competition-map' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'competition-map' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''
                }`}
              >
                <Map className="h-4 w-4" />
                Competition Map
              </Button>

              <Button
                onClick={() => setActiveView('market-benchmarks')}
                variant={activeView === 'market-benchmarks' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'market-benchmarks' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''
                }`}
              >
                <Target className="h-4 w-4" />
                Market Benchmarks
              </Button>

              <Button
                onClick={() => setActiveView('volume-share')}
                variant={activeView === 'volume-share' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'volume-share' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
                }`}
              >
                <PieChart className="h-4 w-4" />
                Volume & Share
              </Button>

              <Button
                onClick={() => setActiveView('payer-mix')}
                variant={activeView === 'payer-mix' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'payer-mix' ? 'bg-gradient-to-r from-orange-600 to-red-600' : ''
                }`}
              >
                <Percent className="h-4 w-4" />
                Payer Mix
              </Button>

              <Button
                onClick={() => setActiveView('referral-network')}
                variant={activeView === 'referral-network' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'referral-network' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : ''
                }`}
              >
                <Users className="h-4 w-4" />
                Referral Network
              </Button>

              <Button
                onClick={() => setActiveView('procedure-intel')}
                variant={activeView === 'procedure-intel' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'procedure-intel' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : ''
                }`}
              >
                <Activity className="h-4 w-4" />
                Procedure Intel
              </Button>

              <Button
                onClick={() => setActiveView('demographics')}
                variant={activeView === 'demographics' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'demographics' ? 'bg-gradient-to-r from-amber-600 to-orange-600' : ''
                }`}
              >
                <Award className="h-4 w-4" />
                Demographics
              </Button>

              <Button
                onClick={() => setActiveView('contract-intel')}
                variant={activeView === 'contract-intel' ? 'default' : 'outline'}
                className={`rounded-2xl flex items-center gap-2 justify-start ${
                  activeView === 'contract-intel' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''
                }`}
              >
                <DollarSign className="h-4 w-4" />
                Contract Intel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 1. COMPETITION MAP */}
        {activeView === 'competition-map' && (
          <>
            <Card className="rounded-3xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  Geographic Competition Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label>Pin Location</Label>
                    <Input
                      type="text"
                      value={selectedLocation.name}
                      className="rounded-2xl mt-2"
                      readOnly
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Lat: {selectedLocation.lat}, Lng: {selectedLocation.lng}
                    </p>
                  </div>
                  <div>
                    <Label>Search Radius</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 5, 10, 25, 50].map((r) => (
                        <Button
                          key={r}
                          onClick={() => setRadius(r)}
                          variant={radius === r ? 'default' : 'outline'}
                          className={`rounded-2xl ${
                            radius === r ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''
                          }`}
                        >
                          {r} mi
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-12 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-24 w-24 text-blue-600 animate-pulse" />
                  </div>
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold mb-2">Interactive Map View</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Drop a pin to analyze competition within {radius} mile radius
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      (Map integration: Google Maps, Mapbox, or Leaflet)
                    </p>
                  </div>
                </div>

                {/* Competition Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Card className="rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Competitors Found
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {competitors.length}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Within {radius} miles
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Market Density
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {(competitors.length / (Math.PI * radius * radius)).toFixed(1)}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Per sq mile
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Avg Competitor Rate
                      </div>
                      <div className="text-3xl font-bold text-emerald-600">
                        {formatCurrency(competitors.reduce((sum, c) => sum + c.avgRate, 0) / competitors.length)}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        For CPT 66984
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Your Position
                      </div>
                      <div className="text-3xl font-bold text-amber-600">
                        #{Math.floor(competitors.length * 0.35)}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        By volume rank
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Competitors Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Practice</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Distance</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Avg Rate</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Volume</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Market Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitors.slice(0, 10).map((comp, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="py-3 px-4 text-sm font-medium">{comp.name}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                              {comp.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-right">{comp.distance} mi</td>
                          <td className="py-3 px-4 text-sm text-right font-semibold">{formatCurrency(comp.avgRate)}</td>
                          <td className="py-3 px-4 text-sm text-right">{comp.volume}</td>
                          <td className="py-3 px-4 text-sm text-right text-slate-600">{comp.marketShare}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 2. MARKET BENCHMARKS */}
        {activeView === 'market-benchmarks' && (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Your Rate
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(marketBenchmarks.yourRate)}
                  </div>
                  <div className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" />
                    {marketBenchmarks.competitivePosition}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Market Median
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(marketBenchmarks.marketMedian)}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    50th percentile
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Your Percentile
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {marketBenchmarks.percentile}th
                  </div>
                  <div className="text-sm text-amber-600 mt-1">
                    {marketBenchmarks.pricingOpportunity}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl mb-8">
              <CardHeader>
                <CardTitle>Rate Position vs. Market Percentiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "25th Percentile", value: marketBenchmarks.market25th, color: "bg-red-500" },
                    { label: "Market Median (50th)", value: marketBenchmarks.marketMedian, color: "bg-yellow-500" },
                    { label: "Your Rate", value: marketBenchmarks.yourRate, color: "bg-blue-600" },
                    { label: "75th Percentile", value: marketBenchmarks.market75th, color: "bg-emerald-500" },
                    { label: "90th Percentile", value: marketBenchmarks.market90th, color: "bg-purple-500" }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3">
                        <div 
                          className={`${item.color} h-3 rounded-full`}
                          style={{ width: `${(item.value / marketBenchmarks.market90th) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 3. VOLUME & SHARE */}
        {activeView === 'volume-share' && (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Current Volume
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {volumeData[volumeData.length - 1].volume}
                  </div>
                  <div className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +{volumeData[volumeData.length - 1].growth}%
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Market Share
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {volumeData[volumeData.length - 1].marketShare}%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Philadelphia CBSA
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    6-Month Growth
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    +32.7%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Jul - Dec 2024
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Volume Trend & Market Share Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Month</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Volume</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Market Share</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Growth %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volumeData.map((month, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-900">
                          <td className="py-3 px-4 text-sm font-medium">{month.month}</td>
                          <td className="py-3 px-4 text-sm text-right font-bold">{month.volume}</td>
                          <td className="py-3 px-4 text-sm text-right text-blue-600 font-semibold">{month.marketShare}%</td>
                          <td className="py-3 px-4 text-sm text-right">
                            <span className={`flex items-center justify-end gap-1 ${month.growth > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {month.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {month.growth > 0 ? '+' : ''}{month.growth}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 4. PAYER MIX */}
        {activeView === 'payer-mix' && (
          <>
            <Card className="rounded-3xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-orange-600" />
                  Payer Mix Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PricingChart
                  title=""
                  data={payerMix.map(p => ({
                    label: `${p.payer} (${p.percentage}%)`,
                    value: p.percentage,
                    color: 'bg-gradient-to-r from-orange-500 to-red-500'
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Payer Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Payer</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">% of Volume</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Avg Rate</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Denial Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payerMix.map((payer, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-900">
                          <td className="py-3 px-4 text-sm font-medium">{payer.payer}</td>
                          <td className="py-3 px-4 text-sm text-right font-bold text-orange-600">{payer.percentage}%</td>
                          <td className="py-3 px-4 text-sm text-right font-semibold">{formatCurrency(payer.avgRate)}</td>
                          <td className="py-3 px-4 text-sm text-right">
                            <span className={payer.denialRate > 5 ? 'text-red-600' : 'text-emerald-600'}>
                              {payer.denialRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 5. REFERRAL NETWORK */}
        {activeView === 'referral-network' && (
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                Top Referral Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Referring Physician</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Specialty</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Referrals</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Conversion Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">NPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralSources.map((ref, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-900">
                        <td className="py-3 px-4 text-sm font-medium">{ref.physician}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{ref.specialty}</td>
                        <td className="py-3 px-4 text-sm text-right font-bold text-cyan-600">{ref.referrals}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className="text-emerald-600 font-semibold">{ref.conversionRate}%</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-slate-500">{ref.npi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 6. PROCEDURE INTEL */}
        {activeView === 'procedure-intel' && (
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-600" />
                Procedure-Specific Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-3 px-4 font-semibold text-sm">CPT Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Volume</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Trend</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Avg Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procedureIntel.map((proc, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-900">
                        <td className="py-3 px-4 text-sm font-mono font-bold text-violet-600">{proc.cpt}</td>
                        <td className="py-3 px-4 text-sm">{proc.description}</td>
                        <td className="py-3 px-4 text-sm text-right font-bold">{proc.volume}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={`flex items-center justify-end gap-1 ${proc.trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {proc.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {proc.trend > 0 ? '+' : ''}{proc.trend}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold">{formatCurrency(proc.avgRate)}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-bold">{proc.profitMargin}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7. DEMOGRAPHICS */}
        {activeView === 'demographics' && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Avg Patient Age
                  </div>
                  <div className="text-3xl font-bold text-amber-600">
                    {demographics.avgAge}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    years
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Readmission Rate
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {demographics.outcomes.readmissionRate}%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Below national avg
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Patient Satisfaction
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {demographics.outcomes.patientSatisfaction}/5
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Stars
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Complication Rate
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {demographics.outcomes.complicationRate}%
                  </div>
                  <div className="text-sm text-emerald-600 mt-1">
                    Excellent
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <PricingChart
                    title=""
                    data={demographics.ageDistribution.map(age => ({
                      label: age.range,
                      value: age.percentage,
                      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }))}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Common Comorbidities</CardTitle>
                </CardHeader>
                <CardContent>
                  <PricingChart
                    title=""
                    data={demographics.comorbidities.map(c => ({
                      label: c.condition,
                      value: c.percentage,
                      color: 'bg-gradient-to-r from-red-500 to-pink-500'
                    }))}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 8. CONTRACT INTEL */}
        {activeView === 'contract-intel' && (
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Contract Negotiation Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Payer</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Current Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Market Median</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Opportunity</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Recommendation</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractIntel.map((contract, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-900">
                        <td className="py-3 px-4 text-sm font-medium">{contract.payer}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold">{formatCurrency(contract.currentRate)}</td>
                        <td className="py-3 px-4 text-sm text-right">{formatCurrency(contract.marketMedian)}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={contract.opportunity.includes('+') ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                            {contract.opportunity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{contract.recommendation}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            contract.priority === 'High' ? 'bg-red-100 text-red-700' :
                            contract.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {contract.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link href="/price-transparency/analytics">
            <Button variant="outline" className="rounded-2xl">
              Back to Analytics
            </Button>
          </Link>
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
      </div>
    </main>
  );
}
