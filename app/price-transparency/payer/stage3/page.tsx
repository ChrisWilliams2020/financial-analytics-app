"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import StageHeader from "@/components/StageHeader";

export default function PayerStage3() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader title="Payer • Stage 3: Modeling & KPIs (Payer view)" />

        <Card className="rounded-3xl mb-6">
          <CardContent className="py-8 text-center text-slate-600 dark:text-slate-300">
            <p>Payer-focused visualizations and actions for stage 3 go here.</p>
            <p className="mt-2 text-sm">
              Cost modeling, utilization analytics, and risk assessment tools.
            </p>
          </CardContent>
        </Card>

        <Link href="/price-transparency/collaborative">
          <Card className="rounded-2xl hover:shadow-lg transition cursor-pointer border-2 hover:border-emerald-600">
            <CardContent className="py-4 flex items-center justify-between">
              <span className="font-semibold">
                Go to Collaborative Payment Options
              </span>
              <ArrowRight className="h-5 w-5 text-emerald-600" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
