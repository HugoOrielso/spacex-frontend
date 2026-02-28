// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import SummaryCards from "../components/SummaryCards";
import TotalLaunchesCard from "../components/TotalLaunchesCard";
import LaunchesPerYearLineChart from "../components/LaunchesPerYearLineChart";
import TotalLaunchesByYearChart from "../components/TotalLaunchesByYearChart";
import LatestLaunchesTable from "../components/LatestLaunchesTable";
import { getByYear, getLaunches, getSummary } from "@/lib/api/client";
import StatusBreakdownDonut from "@/components/StatusBreakDownDonut";


export default function HomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byYear, setByYear] = useState<YearStat[]>([]);
  const [latestLaunches, setLatestLaunches] = useState<Launch[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  // Cargar estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        setLoadingSummary(true);
        setLoadingYear(true);

        const [summaryData, byYearData] = await Promise.all([
          getSummary(),
          getByYear(),
        ]);

        setSummary(summaryData);
        setByYear(byYearData);
      } catch (e) {
        console.error(e);
        setError("Error fetching statistics from API");
      } finally {
        setLoadingSummary(false);
        setLoadingYear(false);
      }
    };

    fetchStats();
  }, []);

  // Últimos 5 lanzamientos
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoadingLatest(true);
        const filters: LaunchFilters = { limit: 5, offset: 0 };
        const launches = await getLaunches(filters);
        setLatestLaunches(launches);
      } catch (e) {
        console.error(e);
        setError((prev) => prev || "Error fetching latest launches");
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchLatest();
  }, []);

  // Health check


  const hasData = useMemo(
    () => !!summary && (summary.total ?? 0) > 0,
    [summary]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Fondo espacial */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(129,140,248,0.22),transparent_55%)]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5 md:px-6  lg:px-8">
        {/* Header simple */}
        <header className="mb-6 flex items-center justify-between gap-3">

        </header>

        {/* Error global */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        {/* TOP: stats + total card */}
        <section className="mb-6">
          <TotalLaunchesCard summary={summary} loading={loadingSummary} />
        </section>

        {/* STATS abajo del hero */}
        <section className="mb-6">
          <SummaryCards summary={summary} loading={loadingSummary} />
        </section>

        {/* SECOND ROW: line chart + donut */}
        <section className="mb-6 grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <LaunchesPerYearLineChart
              data={byYear}
              loading={loadingYear}
            />
          </div>
          <StatusBreakdownDonut
            summary={summary}
            loading={loadingSummary}
          />
        </section>

        {/* THIRD ROW: bar chart */}
        <section className="mb-6">
          <TotalLaunchesByYearChart
            data={byYear}
            loading={loadingYear}
          />
        </section>

        {/* LATEST 5 LAUNCHES */}
        <section className="mb-6">
          <LatestLaunchesTable
            launches={latestLaunches}
            loading={loadingLatest}
          />
        </section>

        <footer className="mt-auto py-3 text-center text-[11px] text-slate-500">
          Built with Next.js · Tailwind · Recharts · Axios
        </footer>
      </div>
    </div>
  );
}