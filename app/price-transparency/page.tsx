"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PriceTransparencyEntry() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Advanced Price Transparency
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Select your role to continue:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/price-transparency/provider/stage1">
            <Card className="rounded-3xl hover:shadow-xl transition-all cursor-pointer h-full border-2 hover:border-cyan-600">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  Provider
                  <ArrowRight className="h-6 w-6 text-cyan-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 dark:text-slate-300">
                <p>
                  Upload practice data, compare market rates, and negotiate
                  stronger payer contracts.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/price-transparency/payer/stage1">
            <Card className="rounded-3xl hover:shadow-xl transition-all cursor-pointer h-full border-2 hover:border-emerald-600">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  Payer
                  <ArrowRight className="h-6 w-6 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 dark:text-slate-300">
                <p>
                  Analyze provider data, benchmark costs, and create
                  collaborative payment models.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="rounded-2xl">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
