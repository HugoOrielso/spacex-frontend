"use client";

import { useLaunchesStore } from "@/store/useLaunches";


export function LaunchesFilters() {
    const status = useLaunchesStore((s) => s.status);
    const year = useLaunchesStore((s) => s.year);
    const years = useLaunchesStore((s) => s.years);
    const search = useLaunchesStore((s) => s.search);

    const setStatus = useLaunchesStore((s) => s.setStatus);
    const setYear = useLaunchesStore((s) => s.setYear);
    const setSearch = useLaunchesStore((s) => s.setSearch);
    const resetFilters = useLaunchesStore((s) => s.resetFilters);

    return (
        <section className="mb-4 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
                    {/* Status */}
                    <div className="flex items-center justify-baseline w-full gap-3 ">


                        <div className="flex flex-col gap-1 w-full">
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
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Year
                            </label>
                            <select
                                value={year}
                                onChange={(e) =>
                                    setYear(e.target.value === "all" ? "all" : Number(e.target.value))
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
                        <div className="hidden md:flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Search
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="mission name, rocket, etc."
                                className="h-10 rounded-xl border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-100 shadow-sm outline-none ring-sky-500/40 focus:border-sky-400 focus:ring-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2">

                    <div className="flex-col gap-1 md:hidden">
                        <label className="text-xs hidden font-semibold uppercase tracking-wide text-slate-400">
                            Search
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="mission name, rocket, etc."
                            className="h-10 rounded-xl border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-100 shadow-sm outline-none ring-sky-500/40 focus:border-sky-400 focus:ring-2"
                        />
                    </div>
                    <div className="flex items-end justify-center h-full ">

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="h-9 rounded-xl cursor-pointer border border-red-700 bg-red-900 px-4 text-xs font-medium text-slate-200 hover:bg-red-800/80"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}