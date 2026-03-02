// components/TotalLaunchesByYearChart.tsx
"use client";

import { useLaunchesStore } from "@/store/useLaunches";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

const TotalLaunchesByYearChart: React.FC = () => {
  const data = useLaunchesStore((state) => state.byYear);
  const loading = useLaunchesStore((state) => state.loadingYear);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-xl">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
          Total launches by year
        </h2>
        <p className="text-xs text-slate-400">
          Year-over-year growth of launches.
        </p>
      </div>

      <div className="h-72">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Loading chart…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="year"
                stroke="#9ca3af"
                tickLine={false}
                fontSize={12}
              />
              <YAxis
                stroke="#9ca3af"
                tickLine={false}
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: 12,
                  border: "1px solid #1f2937",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="total"
                name="Total"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TotalLaunchesByYearChart;