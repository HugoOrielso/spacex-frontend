/* eslint-disable @next/next/no-img-element */
// components/launches/LaunchesTable.tsx
"use client";

import React, { useState } from "react";
import {
  formatDate,
  shortId,
  statusLabel,
  statusPillClasses,
} from "@/lib/ui-helper";
import { AnimatePresence, motion } from "framer-motion";
import { useLaunchesStore } from "@/store/useLaunches";

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
    {children}
  </th>
);

const InfoBadge: React.FC<{ label: string; children: React.ReactNode }> = ({
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
                  onClick={() => setSelected(l)}
                  className="cursor-pointer border-b border-slate-800/60 last:border-b-0 hover:bg-slate-900/80"
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
      </section>

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            {/* Card */}
            <motion.div
              className="relative z-50 w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex items-start gap-3 pb-4">
                {selected.patch_large && (
                  <img
                    src={selected.patch_large}
                    alt={selected.mission_name ?? "Patch"}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-50">
                    {selected.mission_name || "Unnamed mission"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Launch ID: {selected.launch_id}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium " +
                        statusPillClasses[selected.status ?? "unknown"]
                      }
                    >
                      {statusLabel[selected.status ?? "unknown"]}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-200">
                      {formatDate(selected.date_utc, selected.date_local)}
                    </span>
                    {selected.flight_number != null && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-200">
                        Flight #{selected.flight_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid info rápida */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <InfoBadge label="Rocket ID">
                  {selected.rocket_id ?? "—"}
                </InfoBadge>
                <InfoBadge label="Launchpad ID">
                  {selected.launchpad_id ?? "—"}
                </InfoBadge>
                <InfoBadge label="Upcoming">
                  {selected.upcoming == null
                    ? "Unknown"
                    : selected.upcoming
                    ? "Yes"
                    : "No"}
                </InfoBadge>
                <InfoBadge label="Success">
                  {selected.success == null
                    ? "Unknown"
                    : selected.success
                    ? "Yes"
                    : "No"}
                </InfoBadge>
              </div>

              {/* Detalles / descripción */}
              {selected.details && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Mission details
                  </div>
                  <p className="text-sm leading-relaxed">{selected.details}</p>
                </div>
              )}

              {/* Links externos */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {selected.article && (
                  <a
                    href={selected.article}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                  >
                    📰 <span>Open article</span>
                  </a>
                )}
                {selected.webcast && (
                  <a
                    href={selected.webcast}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                  >
                    📺 <span>Watch webcast</span>
                  </a>
                )}
                {selected.wikipedia && (
                  <a
                    href={selected.wikipedia}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                  >
                    📚 <span>View on Wikipedia</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}