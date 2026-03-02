// components/main/LatestLaunchesTable.tsx
"use client";

import React, { useState } from "react";
import { formatDate, shortId, statusLabel, statusPillClasses } from "@/lib/ui-helper";
import { useLaunchesStore } from "@/store/useLaunches";
import { LaunchDetailModal } from "../common/LaunchModal";
import Image from "next/image";

const LatestLaunchesTable: React.FC = () => {
  const launches = useLaunchesStore((state) => state.latestLaunches);
  const loading = useLaunchesStore((state) => state.loadingLatest);
  const [selected, setSelected] = useState<Launch | null>(null);

  return (
    <>
      <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              Latest launches
            </h2>
            <p className="text-xs text-slate-400">
              {loading
                ? "Loading last missions…"
                : `${launches.length} most recent launches`}
            </p>
          </div>
        </div>

        {/* Lista */}
        <div className="max-h-80 space-y-2 overflow-auto px-3 py-3">
          {launches.length === 0 && !loading && (
            <div className="py-6 text-center text-sm text-slate-400">
              No launches found.
            </div>
          )}

          {loading && launches.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-400">
              Loading…
            </div>
          )}

          {launches.map((l) => (
            <button
              key={l.launch_id}
              type="button"
              onClick={() => setSelected(l)}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-left shadow-sm transition-colors hover:border-sky-500/70 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                {l.patch_small && (
                  <Image width={24} height={24}
                    src={l.patch_small}
                    alt={l.mission_name ?? "Patch"}
                    className="h-9 w-9 shrink-0 rounded-xl border border-slate-700/80 bg-slate-950 object-contain"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-50">
                    {l.mission_name || "Unnamed mission"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(l.date_utc, l.date_local)} · ID{" "}
                    {shortId(l.launch_id)}
                  </span>
                  {l.flight_number != null && (
                    <span className="text-[11px] text-slate-500">
                      Flight #{l.flight_number}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 cursor-pointer">
                <span
                  className={
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                    statusPillClasses[l.status ?? "unknown"]
                  }
                >
                  {statusLabel[l.status ?? "unknown"]}
                </span>
                <span className="text-[11px] text-sky-400">
                  View details →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <LaunchDetailModal launch={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default LatestLaunchesTable;