"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Shield, ArrowRight } from "lucide-react";
import StageHeader from "@/components/StageHeader";

export default function CollaborativePaymentOptions() {
  const paymentModels = [
    {
      title: "Shared Revenue Model",
      description: "Define revenue split, baselines, and outcome metrics",
      icon: DollarSign,
      href: "/price-transparency/collab/shared-revenue",
      color: "text-cyan-600",
    },
    {
      title: "Enhanced Reimbursement (Selective CPT)",
      description: "Select CPT codes and set enhancement rules/thresholds",
      icon: TrendingUp,
      href: "/price-transparency/collab/enhanced-cpt",
      color: "text-emerald-600",
    },
    {
      title: "Risk Sharing Model",
      description: "Configure upside/downside corridors, stop-loss, and quality gates",
      icon: Shield,
      href: "/price-transparency/collab/risk-sharing",
      color: "text-blue-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader
          title="Collaborative Payment Options"
          subtitle="Co-design payment models that benefit both parties"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {paymentModels.map((model) => (
            <Link key={model.href} href={model.href}>
              <Card className="rounded-3xl hover:shadow-xl transition-all cursor-pointer h-full border-2 hover:border-cyan-600">
                <CardHeader>
                  <div className={`${model.color} mb-3`}>
                    <model.icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl">{model.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    {model.description}
                  </p>
                  <div className="flex items-center text-cyan-600 text-sm font-semibold">
                    Configure <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
