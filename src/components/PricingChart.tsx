"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/mathematica-api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PricingDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface PricingChartProps {
  title: string;
  data: PricingDataPoint[];
  type?: 'bar' | 'comparison';
  showTrend?: boolean;
}

export function PricingChart({ title, data, type = 'bar', showTrend = false }: PricingChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color || 'bg-gradient-to-r from-cyan-600 to-emerald-600'
                  }`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonTableProps {
  data: Array<{
    label: string;
    yourRate?: number;
    benchmarkRate: number;
    variance: number;
  }>;
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">
              Payer
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">
              Your Rate
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">
              Benchmark
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">
              Variance
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
            >
              <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                {row.label}
              </td>
              <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900 dark:text-slate-100">
                {row.yourRate ? formatCurrency(row.yourRate) : '—'}
              </td>
              <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-400">
                {formatCurrency(row.benchmarkRate)}
              </td>
              <td className="py-3 px-4 text-sm text-right">
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    row.variance > 0
                      ? 'text-emerald-600'
                      : row.variance < 0
                      ? 'text-red-600'
                      : 'text-slate-600'
                  }`}
                >
                  {row.variance > 0 && <TrendingUp className="h-4 w-4" />}
                  {row.variance < 0 && <TrendingDown className="h-4 w-4" />}
                  {row.variance === 0 && <Minus className="h-4 w-4" />}
                  {Math.abs(row.variance).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({ title, value, subtitle, trend, trendValue }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="pt-6">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          {title}
        </div>
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 text-sm">
            {trend && (
              <span className={`inline-flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-slate-600 dark:text-slate-400">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
