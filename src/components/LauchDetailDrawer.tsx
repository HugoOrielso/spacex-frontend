// components/LaunchDetailDrawer.tsx
"use client";

import React from "react";
import Image from "next/image";
import { formatDate, statusLabel, statusPillClasses } from "@/lib/ui-helper";

interface Props {
    launch: Launch | null;
    open: boolean;
    onClose: () => void;
    loading: boolean;
}

const LaunchDetailDrawer: React.FC<Props> = ({
    launch,
    open,
    onClose,
    loading,
}) => {
    return (
        <div
            className={`fixed inset-y-0 right-0 z-40 w-full max-w-md transform border-l border-slate-800 bg-slate-950/95 shadow-xl backdrop-blur transition-transform ${open ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Launch details
                    </h2>
                    <p className="text-xs text-slate-400">{launch?.launch_id ?? "—"}</p>
                </div>
                <button
                    onClick={onClose}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                    ✕
                </button>
            </div>

            <div className="h-full overflow-y-auto px-4 py-3">
                {loading && (
                    <div className="py-6 text-center text-sm text-slate-400">
                        Loading launch information…
                    </div>
                )}

                {!loading && !launch && (
                    <div className="py-6 text-center text-sm text-slate-400">
                        No launch selected.
                    </div>
                )}

                {!loading && launch && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {launch.patch_large && (
                                <Image
                                    src={launch.patch_large}
                                    alt={launch.mission_name ?? "Patch"}
                                    width={64}
                                    height={64}
                                    className="h-16 w-16 rounded-2xl border border-slate-700 bg-slate-900 object-contain"
                                />
                            )}
                            <div>
                                <div className="text-lg font-semibold text-slate-50">
                                    {launch.mission_name ?? "Unnamed mission"}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Flight #{launch.flight_number ?? "—"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <DetailField label="Status">
                                <span
                                    className={
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
                                        statusPillClasses[launch.status ?? "unknown"]
                                    }
                                >
                                    {statusLabel[launch.status ?? "unknown"]}
                                </span>
                            </DetailField>
                            <DetailField label="Rocket ID">
                                {launch.rocket_id ?? "—"}
                            </DetailField>
                            <DetailField label="Launchpad ID">
                                {launch.launchpad_id ?? "—"}
                            </DetailField>
                            <DetailField label="Date (UTC)">
                                {formatDate(launch.date_utc, null)}
                            </DetailField>
                            <DetailField label="Date (Local)">
                                {formatDate(null, launch.date_local)}
                            </DetailField>
                            <DetailField label="Success">
                                {launch.success == null
                                    ? "Unknown"
                                    : launch.success
                                        ? "Yes"
                                        : "No"}
                            </DetailField>
                        </div>

                        {launch.details && (
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Details
                                </div>
                                <p className="text-sm leading-relaxed">{launch.details}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 text-xs">
                            {launch.article && (
                                <a
                                    href={launch.article}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                                >
                                    <span className="text-lg">📰</span>
                                    <span>Open article</span>
                                </a>
                            )}
                            {launch.webcast && (
                                <a
                                    href={launch.webcast}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                                >
                                    <span className="text-lg">📺</span>
                                    <span>Open webcast</span>
                                </a>
                            )}
                            {launch.wikipedia && (
                                <a
                                    href={launch.wikipedia}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                                >
                                    <span className="text-lg">📚</span>
                                    <span>Open Wikipedia</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailField: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
        </span>
        <span className="wrap-break-word text-xs text-slate-100">{children}</span>
    </div>
);

export default LaunchDetailDrawer;