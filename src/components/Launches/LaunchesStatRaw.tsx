// components/launches/LaunchesStatsRow.tsx
"use client";

import { useLaunchesStore } from "@/store/useLaunches";


const StatCard: React.FC<{
  label: string;
  value: number;
  subtitle?: string;
  accent: string;
}> = ({ label, value, subtitle, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 shadow-md">
    <div
      className={`pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-linear-to-br ${accent} blur-2xl opacity-70`}
    />
    <div className="relative flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
        {label}
      </span>
      <span className="text-2xl font-semibold text-slate-50">
        {value.toLocaleString()}
      </span>
      {subtitle && (
        <span className="text-[11px] text-slate-400">{subtitle}</span>
      )}
    </div>
  </div>
);

export function LaunchesStatsRow() {
  const stats = useLaunchesStore((s) => s.stats);
  const globalSummary = useLaunchesStore((s) => s.globalSummary);

  return (
    <section className="mb-4 hidden gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-5">
      <StatCard
        label="Total (all time)"
        value={globalSummary?.total ?? 0}
        subtitle="Unfiltered database count"
        accent="from-indigo-500/80 to-sky-400/80"
      />
      <StatCard
        label="Total in page"
        value={stats.total}
        accent="from-sky-500/80 to-cyan-400/80"
      />
      <StatCard
        label="Success"
        value={stats.success}
        subtitle={
          stats.total
            ? `${((stats.success / stats.total) * 100).toFixed(1)}%`
            : "—"
        }
        accent="from-emerald-500/80 to-lime-400/80"
      />
      <StatCard
        label="Failed"
        value={stats.failed}
        subtitle={
          stats.total
            ? `${((stats.failed / stats.total) * 100).toFixed(1)}%`
            : "—"
        }
        accent="from-rose-500/80 to-orange-400/80"
      />
      <StatCard
        label="Upcoming"
        value={stats.upcoming}
        subtitle={
          stats.total
            ? `${((stats.upcoming / stats.total) * 100).toFixed(1)}%`
            : "—"
        }
        accent="from-amber-400/80 to-yellow-300/80"
      />
    </section>
  );
}