import React from "react";

interface StageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function StageHeader({ title, subtitle }: StageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p>
      )}
    </div>
  );
}
