"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Upload } from "lucide-react";
import StageHeader from "@/components/StageHeader";

export default function ProviderStage1() {
  const [tin, setTin] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tin", tin);

    try {
      // TODO: Replace with actual API endpoint
      await fetch("/api/contracts/upload", {
        method: "POST",
        body: formData,
      });
      alert("Upload successful!");
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <StageHeader
          title="Provider • Stage 1: Data Upload/Integration"
          subtitle="Upload files or connect EMR/PM"
        />

        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="TIN"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  className="rounded-2xl"
                />
              </div>

              <div>
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {file ? file.name : "Click to upload file"}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <Button
                type="submit"
                disabled={uploading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link href="/price-transparency/provider/stage2">
            <Card className="rounded-2xl hover:shadow-lg transition cursor-pointer border-2 hover:border-cyan-600">
              <CardContent className="py-4 flex items-center justify-between">
                <span className="font-semibold">Next: Market Comparison</span>
                <ArrowRight className="h-5 w-5 text-cyan-600" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
