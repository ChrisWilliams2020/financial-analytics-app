"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StageHeader from "@/components/StageHeader";

export default function EnhancedCptModel() {
  const [cptCode, setCptCode] = useState("");
  const [enhancementPercent, setEnhancementPercent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("CPT enhancement configuration saved! (Wire to backend as needed)");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader title="Enhanced Reimbursement – Selective CPT" />

        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Select CPT codes and set enhancement rules/thresholds. (Wire to
              backend as needed.)
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="cptCode">CPT Code</Label>
                <Input
                  id="cptCode"
                  type="text"
                  placeholder="e.g., 99213"
                  value={cptCode}
                  onChange={(e) => setCptCode(e.target.value)}
                  className="rounded-2xl mt-2"
                />
              </div>

              <div>
                <Label htmlFor="enhancementPercent">
                  Enhancement Percentage (%)
                </Label>
                <Input
                  id="enhancementPercent"
                  type="number"
                  placeholder="e.g., 15"
                  value={enhancementPercent}
                  onChange={(e) => setEnhancementPercent(e.target.value)}
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
