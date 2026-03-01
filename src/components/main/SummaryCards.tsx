"use client";

import { useLaunchesStore } from "@/store/useLaunches";
import React, { useMemo } from "react";

const SummaryCards: React.FC = () => {
  // Leemos del store en vez de recibir props
  const summary = useLaunchesStore((state) => state.globalSummary);
  const loading = useLaunchesStore((state) => state.loadingSummary);

  const items = useMemo(
    () => [
      {
        key: "success",
        label: "Successful",
        value: summary?.success ?? 0,
        accent: "from-emerald-500/80 to-lime-400/80",
      },
      {
        key: "failed",
        label: "Failed",
        value: summary?.failed ?? 0,
        accent: "from-rose-500/80 to-orange-400/80",
      },
      {
        key: "upcoming",
        label: "Upcoming",
        value: summary?.upcoming ?? 0,
        accent: "from-amber-400/80 to-yellow-300/80",
      },
      {
        key: "unknown",
        label: "Unknown",
        value: summary?.unknown ?? 0,
        accent: "from-slate-400/80 to-zinc-300/80",
      },
    ],
    [summary]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((card) => (
        <div
          key={card.key}
          className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 px-5 py-4 shadow-lg"
        >
          <div
            className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-linear-to-br ${card.accent} blur-2xl opacity-70`}
          />
          <div className="relative flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {card.label}
            </span>
            <span className="text-3xl font-semibold text-slate-50">
              {loading ? "…" : card.value.toLocaleString()}
            </span>
            {summary && summary.total > 0 && (
              <span className="text-xs text-slate-400">
                {loading
                  ? ""
                  : `${((card.value / summary.total) * 100).toFixed(1)}%`}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;