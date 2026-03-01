"use client";

import Header from "@/components/common/Header";
import { LaunchesFilters } from "@/components/Launches/LaunchesFilter";
import { LaunchesPagination } from "@/components/Launches/LaunchesPagination";
import { LaunchesStatsRow } from "@/components/Launches/LaunchesStatRaw";
import { LaunchesTable } from "@/components/Launches/LaunchesTable";
import { useLaunchesStore } from "@/store/useLaunches";
import { useEffect } from "react";

export default function LaunchesPage() {
    const init = useLaunchesStore((s) => s.init);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* halo de fondo */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(129,140,248,0.2),transparent_55%)]" />
            </div>

            <Header />

            <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-5 md:px-6 lg:px-8">
                <LaunchesStatsRow />
                <LaunchesFilters />
                <LaunchesTable />
                <LaunchesPagination />
            </main>
        </div>
    );
}