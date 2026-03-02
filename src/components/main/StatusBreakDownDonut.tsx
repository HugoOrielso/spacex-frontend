/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StatusBreakdownDonut.tsx
"use client";

import { useLaunchesStore } from "@/store/useLaunches";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = {
  success: "#22c55e",
  failed: "#f97373",
  upcoming: "#facc15",
  unknown: "#9ca3af",
};

const StatusBreakdownDonut: React.FC = () => {
  // 👇 Antes venían por props
  const summary = useLaunchesStore((state) => state.globalSummary);
  const loading = useLaunchesStore((state) => state.loadingSummary);

  const total = summary?.total ?? 0;

  const data = useMemo(() => {
    if (!summary || total === 0) return [];
    return [
      {
        name: "Success",
        key: "success",
        value: summary.success,
        color: COLORS.success,
      },
      {
        name: "Failed",
        key: "failed",
        value: summary.failed,
        color: COLORS.failed,
      },
      {
        name: "Upcoming",
        key: "upcoming",
        value: summary.upcoming,
        color: COLORS.upcoming,
      },
      {
        name: "Unknown",
        key: "unknown",
        value: summary.unknown,
        color: COLORS.unknown,
      },
    ].filter((d) => d.value > 0);
  }, [summary, total]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-xl">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
          Status breakdown
        </h2>
        <p className="text-xs text-slate-400">
          Distribution of mission outcomes.
        </p>
      </div>

      <div className="flex h-72 flex-col items-center justify-center gap-4 md:flex-row">
        {loading || !summary || total === 0 ? (
          <div className="text-sm text-slate-400">No data yet…</div>
        ) : (
          <>
            <div className="h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    color="white"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, _name, props: any) => {
                      const v = Number(value);
                      const pct = ((v / total) * 100).toFixed(1) + "%";
                      return [`${v} (${pct})`, props.name];
                    }}
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderRadius: 12,
                      border: "1px solid #1f2937",
                      fontSize: 12,
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#ffffff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {data.map((d) => {
                return (
                  <div key={d.key} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-100">
                        {d.name}
                      </span>
                      <span className="text-slate-400">
                        {d.value} 
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBreakdownDonut;