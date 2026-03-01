// app/page.tsx
"use client";

import { useEffect } from "react";

import TotalLaunchesCard from "@/components/main/TotalLaunchesCard";
import SummaryCards from "@/components/main/SummaryCards";
import LaunchesPerYearLineChart from "@/components/main/LaunchesPerYearLineChart";
import TotalLaunchesByYearChart from "@/components/main/TotalLaunchesByYearChart";
import LatestLaunchesTable from "@/components/main/LatestLaunchesTable";
import { useLaunchesStore } from "@/store/useLaunches";
import StatusBreakdownDonut from "@/components/main/StatusBreakDownDonut";
import Header from "@/components/common/Header";


export default function HomePage() {
  const initDashboard = useLaunchesStore((state) => state.initDashboard);
  const error = useLaunchesStore((state) => state.error);

  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Fondo espacial */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(129,140,248,0.22),transparent_55%)]" />
      </div>
      <Header />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5 md:px-6 lg:px-8">


        {/* Error global opcional */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <section className="mb-6">
          <TotalLaunchesCard />
        </section>

        <section className="mb-6">
          <SummaryCards />
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <LaunchesPerYearLineChart />
          </div>
          <StatusBreakdownDonut />
        </section>

        <section className="mb-6">
          <TotalLaunchesByYearChart />
        </section>

        <section className="mb-6">
          <LatestLaunchesTable />
        </section>

      </div>
    </div>
  );
}