"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import StageHeader from "@/components/StageHeader";

interface BenchmarkResult {
  FedPanel: Record<string, any>;
  MathematicaPanel: Record<string, any>;
}

export default function ProviderStage2() {
  const [tin, setTin] = useState("");
  const [plan, setPlan] = useState("");
  const [cpt, setCpt] = useState("");
  const [region, setRegion] = useState("");
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/market/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tin, plan, cpt, region }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader
          title="Provider • Stage 2: Market Comparison"
          subtitle="Mathematica + Federal Reserve"
        />

        <Card className="rounded-3xl mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="TIN"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                className="rounded-2xl"
              />
              <Input
                type="text"
                placeholder="Insurance Plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="rounded-2xl"
              />
              <Input
                type="text"
                placeholder="CPT Code"
                value={cpt}
                onChange={(e) => setCpt(e.target.value)}
                className="rounded-2xl"
              />
              <Input
                type="text"
                placeholder="Region (optional)"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-2xl"
              />
              <Button
                type="submit"
                disabled={loading}
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600"
              >
                {loading ? "Comparing..." : "Compare"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Federal Reserve Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(result.FedPanel).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800"
                    >
                      <span className="text-slate-600 dark:text-slate-300">
                        {key}
                      </span>
                      <span className="font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Mathematica Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(result.MathematicaPanel).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800"
                    >
                      <span className="text-slate-600 dark:text-slate-300">
                        {key}
                      </span>
                      <span className="font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Link href="/price-transparency/provider/stage3">
          <Card className="rounded-2xl hover:shadow-lg transition cursor-pointer border-2 hover:border-cyan-600">
            <CardContent className="py-4 flex items-center justify-between">
              <span className="font-semibold">Next: Modeling & KPIs</span>
              <ArrowRight className="h-5 w-5 text-cyan-600" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
