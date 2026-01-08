"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageHeader from "@/components/StageHeader";

export default function SharedRevenueModel() {
  const [providerShare, setProviderShare] = useState("50");
  const [payerShare, setPayerShare] = useState("50");
  const [baselineRevenue, setBaselineRevenue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Configuration saved! (Wire to backend as needed)");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader title="Shared Revenue Model" />

        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Define revenue split, baselines, and outcome metrics. (Wire to
              backend as needed.)
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="providerShare">Provider Share (%)</Label>
                  <Input
                    id="providerShare"
                    type="number"
                    value={providerShare}
                    onChange={(e) => setProviderShare(e.target.value)}
                    className="rounded-2xl mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="payerShare">Payer Share (%)</Label>
                  <Input
                    id="payerShare"
                    type="number"
                    value={payerShare}
                    onChange={(e) => setPayerShare(e.target.value)}
                    className="rounded-2xl mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="baselineRevenue">
                  Baseline Revenue ($)
                </Label>
                <Input
                  id="baselineRevenue"
                  type="number"
                  placeholder="100000"
                  value={baselineRevenue}
                  onChange={(e) => setBaselineRevenue(e.target.value)}
                  className="rounded-2xl mt-2"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600"
              >
                Save Configuration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
