/* eslint-disable @next/next/no-img-element */
// app/launches/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    formatDate,
    shortId,
    statusLabel,
    statusPillClasses,
} from "@/lib/ui-helper";
import { getByYear, getLaunches, getSummary } from "@/lib/api/client";

const PAGE_SIZE = 50;

export default function LaunchesPage() {
    const [launches, setLaunches] = useState<Launch[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // filtros
    const [status, setStatus] = useState<LaunchFilters["status"]>("all");
    const [year, setYear] = useState<number | "all">("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [globalSummary, setGlobalSummary] = useState<Summary | null>(null);
    // cargar años desde /stats/by-year para poblar el select
    useEffect(() => {
        const run = async () => {
            try {
                const data: YearStat[] = await getByYear();
                const yrs = data.map((d) => d.year).sort((a, b) => a - b);
                setYears(yrs);
            } catch (e) {
                console.error(e);
            }
        };
        run();
    }, []);

    // cargar lanzamientos cada vez que cambian filtros o página
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const filters: LaunchFilters = {
                    status: status && status !== "all" ? status : undefined,
                    year: year !== "all" ? Number(year) : undefined,
                    search: search.trim() || undefined,
                    limit: PAGE_SIZE,
                    offset: (page - 1) * PAGE_SIZE,
                };

                const data = await getLaunches(filters);
                setLaunches(data);
                setHasMore(data.length === PAGE_SIZE);
            } catch (e) {
                console.error(e);
                setError("Error fetching launches from API");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [status, year, search, page]);

    const stats = useMemo(() => {
        const base = {
            total: launches.length,
            success: 0,
            failed: 0,
            upcoming: 0,
            unknown: 0,
        };
        for (const l of launches) {
            const s = l.status ?? "unknown";
            if (s === "success") base.success++;
            else if (s === "failed") base.failed++;
            else if (s === "upcoming") base.upcoming++;
            else base.unknown++;
        }
        return base;
    }, [launches]);

    const handleReset = () => {
        setStatus("all");
        setYear("all");
        setSearch("");
        setPage(1);
    };

    const handleChangePage = (direction: "prev" | "next") => {
        if (direction === "prev" && page > 1) setPage((p) => p - 1);
        if (direction === "next" && hasMore) setPage((p) => p + 1);
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getSummary();
                setGlobalSummary(data);
            } catch (e) {
                console.error("Error loading global summary", e);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(129,140,248,0.2),transparent_55%)]" />
            </div>

            <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5 md:px-6 lg:px-8">
                {/* HEADER */}
                <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Launch Explorer
                        </h1>
                        <p className="text-xs text-slate-400 md:text-sm">
                            Browse all recorded missions with filters by status, year and
                            search.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="rounded-full bg-slate-800/80 px-3 py-1">
                            Page {page}
                        </span>
                        <span className="rounded-full bg-slate-800/80 px-3 py-1">
                            {stats.total} launches in this page
                        </span>
                    </div>
                </header>

                {/* ERROR */}
                {error && (
                    <div className="mb-4 rounded-2xl border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
                        {error}
                    </div>
                )}

                {/* FILTERS BAR */}
                <section className="mb-4 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
                            {/* Status */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Status
                                </label>
                                <select
                                    value={status ?? "all"}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value === "all"
                                                ? "all"
                                                : (e.target.value as LaunchFilters["status"])
                                        )
                                    }
                                    className="h-10 rounded-xl border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-100 shadow-sm outline-none ring-sky-500/40 focus:border-sky-400 focus:ring-2"
                                >
                                    <option value="all">All</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                            </div>

                            {/* Year */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Year
                                </label>
                                <select
                                    value={year}
                                    onChange={(e) =>
                                        setYear(
                                            e.target.value === "all"
                                                ? "all"
                                                : Number(e.target.value)
                                        )
                                    }
                                    className="h-10 rounded-xl border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-100 shadow-sm outline-none ring-sky-500/40 focus:border-sky-400 focus:ring-2"
                                >
                                    <option value="all">All</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Search (mission / id / rocket)
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Type to filter…"
                                    className="h-10 rounded-xl border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-100 shadow-sm outline-none ring-sky-500/40 focus:border-sky-400 focus:ring-2"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="h-9 rounded-xl border border-slate-700 bg-slate-900 px-4 text-xs font-medium text-slate-200 hover:bg-slate-800/80"
                            >
                                Reset
                            </button>
                            <span className="text-[11px] text-slate-500">
                                Auto-applies on change
                            </span>
                        </div>
                    </div>
                </section>

                {/* SMALL STATS (de la página actual) */}
                <section className="  mb-4 hidden lg:grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

                {/* TABLE */}
                <section className="mb-4 flex-1 rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-xl">
                    <div className="border-b border-slate-800/80 px-4 py-3 text-xs text-slate-400">
                        Showing up to {PAGE_SIZE} launches per page.
                    </div>

                    <div className="max-h-135 overflow-auto">
                        <table className="min-w-full text-left text-sm text-slate-200">
                            <thead className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-900/95">
                                <tr>
                                    <Th>Mission</Th>
                                    <Th>Launch ID</Th>
                                    <Th>Date</Th>
                                    <Th>Status</Th>
                                    <Th>Rocket</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {launches.length === 0 && !loading && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-sm text-slate-400"
                                        >
                                            No launches found for these filters.
                                        </td>
                                    </tr>
                                )}

                                {loading && launches.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-sm text-slate-400"
                                        >
                                            Loading…
                                        </td>
                                    </tr>
                                )}

                                {launches.map((l) => (
                                    <tr
                                        key={l.launch_id}
                                        className="border-b border-slate-800/60 last:border-b-0 hover:bg-slate-900/80"
                                    >
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                {l.patch_small && (
                                                    <img
                                                        src={l.patch_small}
                                                        alt={l.mission_name ?? "Patch"}
                                                        className="h-7 w-7 rounded-lg border border-slate-700/80 bg-slate-900 object-contain"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {l.mission_name || "Unnamed mission"}
                                                    </div>
                                                    {l.flight_number != null && (
                                                        <div className="text-xs text-slate-400">
                                                            Flight #{l.flight_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-xs text-slate-400">
                                            {shortId(l.launch_id)}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {formatDate(l.date_utc, l.date_local)}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                                                    statusPillClasses[l.status ?? "unknown"]
                                                }
                                            >
                                                {statusLabel[l.status ?? "unknown"]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-xs text-slate-300">
                                            {l.rocket_id ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-3 text-xs text-slate-400">
                        <span>
                            Page {page} · {stats.total} launches in this page
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleChangePage("prev")}
                                disabled={page === 1 || loading}
                                className="h-8 rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800/80"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChangePage("next")}
                                disabled={!hasMore || loading}
                                className="h-8 rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800/80"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>

                <footer className="mt-auto py-3 text-center text-[11px] text-slate-500">
                    Launch Explorer · All data from SpaceX API proxy
                </footer>
            </div>
        </div>
    );
}

/* ───── sub-componentes pequeños ───────────────────────────── */

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {children}
    </th>
);

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