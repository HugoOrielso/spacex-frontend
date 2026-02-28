/* eslint-disable @next/next/no-img-element */
// components/LaunchTable.tsx
"use client";

import React from "react";
import { formatDate, shortId, statusLabel, statusPillClasses } from "@/lib/ui-helper";

interface Props {
    launches: Launch[];
    loading: boolean;
    onSelect: (id: string) => void;
}

const LaunchTable: React.FC<Props> = ({ launches, loading, onSelect }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Launches
                    </h2>
                    <p className="text-xs text-slate-400">
                        {loading
                            ? "Loading launches…"
                            : `${launches.length.toLocaleString()} results`}
                    </p>
                </div>
            </div>

            <div className="max-h-115 overflow-auto">
                <table className="min-w-full text-left text-sm text-slate-200">
                    <thead className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-900/95">
                        <tr>
                            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Mission
                            </th>
                            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Launch ID
                            </th>
                            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Date
                            </th>
                            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Status
                            </th>
                            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Rocket
                            </th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {launches.length === 0 && !loading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-slate-400"
                                >
                                    No launches found with current filters.
                                </td>
                            </tr>
                        )}

                        {loading && launches.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-sm text-slate-400"
                                >
                                    Loading…
                                </td>
                            </tr>
                        )}

                        {launches.map((l) => (
                            <tr
                                key={l.launch_id}
                                className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/60"
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
                                <td className="px-4 py-2 text-right">
                                    <button
                                        onClick={() => onSelect(l.launch_id)}
                                        className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-100 transition-colors hover:border-sky-500 hover:bg-slate-900 hover:text-sky-300"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LaunchTable;