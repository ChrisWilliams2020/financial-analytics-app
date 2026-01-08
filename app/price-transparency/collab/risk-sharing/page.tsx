"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageHeader from "@/components/StageHeader";

export default function RiskSharingModel() {
  const [upsideCorridor, setUpsideCorridor] = useState("");
  const [downsideCorridor, setDownsideCorridor] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Risk sharing configuration saved! (Wire to backend as needed)");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader title="Risk Sharing Model" />

        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Configure upside/downside corridors, stop-loss, and quality gates.
              (Wire to backend as needed.)
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="upsideCorridor">
                  Upside Corridor (%)
                </Label>
                <Input
                  id="upsideCorridor"
                  type="number"
                  placeholder="e.g., 10"
                  value={upsideCorridor}
                  onChange={(e) => setUpsideCorridor(e.target.value)}
                  className="rounded-2xl mt-2"
                />
              </div>

              <div>
                <Label htmlFor="downsideCorridor">
                  Downside Corridor (%)
                </Label>
                <Input
                  id="downsideCorridor"
                  type="number"
                  placeholder="e.g., 5"
                  value={downsideCorridor}
                  onChange={(e) => setDownsideCorridor(e.target.value)}
                  className="rounded-2xl mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stopLoss">Stop-Loss Limit ($)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  placeholder="e.g., 50000"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
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
