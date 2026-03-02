// components/launches/LaunchesTable.tsx
"use client";

import React, { useState } from "react";
import { formatDate, shortId, statusLabel, statusPillClasses } from "@/lib/ui-helper";
import { useLaunchesStore } from "@/store/useLaunches";
import { LaunchDetailModal } from "../common/LaunchModal";
import Image from "next/image";

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
    {children}
  </th>
);

export function LaunchesTable() {
  const launches = useLaunchesStore((s) => s.launches);
  const loading = useLaunchesStore((s) => s.loading);
  const [selected, setSelected] = useState<Launch | null>(null);

  return (
    <>
      <section className="mb-4 flex-1 rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-xl">
        <div className="border-b border-slate-800/80 px-4 py-3 text-xs text-slate-400">
          Showing up to 50 launches per page. Click a row to view details.
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
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">
                    No launches found for these filters.
                  </td>
                </tr>
              )}

              {loading && launches.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}

              {launches.map((l) => (
                <tr
                  key={l.launch_id}
                  onClick={() => setSelected(l)}
                  className="cursor-pointer border-b border-slate-800/60 last:border-b-0 hover:bg-slate-900/80"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {l.patch_small && (
                        <Image width={24} height={24} 
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
      </section>

      <LaunchDetailModal launch={selected} onClose={() => setSelected(null)} />
    </>
  );
}