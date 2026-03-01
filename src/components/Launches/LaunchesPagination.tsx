// components/launches/LaunchesPagination.tsx
"use client";

import { useLaunchesStore } from "@/store/useLaunches";


export function LaunchesPagination() {
  const page = useLaunchesStore((s) => s.page);
  const stats = useLaunchesStore((s) => s.stats);
  const nextPage = useLaunchesStore((s) => s.nextPage);
  const prevPage = useLaunchesStore((s) => s.prevPage);
  const hasMore = useLaunchesStore((s) => s.hasMore);
  const loading = useLaunchesStore((s) => s.loading);

  return (
    <div className="flex items-center justify-between rounded-b-2xl border-t border-slate-800/80 bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
      <span>
        Page {page} · {stats.total} launches in this page
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prevPage}
          disabled={page === 1 || loading}
          className="h-8 rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextPage}
          disabled={!hasMore || loading}
          className="h-8 rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}