/* eslint-disable @next/next/no-img-element */
// components/LatestLaunchesTable.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatDate,
  shortId,
  statusLabel,
  statusPillClasses,
} from "@/lib/ui-helper";

interface Props {
  launches: Launch[];
  loading: boolean;
}

const LatestLaunchesTable: React.FC<Props> = ({ launches, loading }) => {
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
                  <img
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

              <div className="flex flex-col items-end gap-1">
                <span
                  className={
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                    statusPillClasses[l.status ?? "unknown"]
                  }
                >
                  {statusLabel[l.status ?? "unknown"]}
                </span>
                <span className="text-[11px] text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">
                  View details →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL DE DETALLE */}
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
              className="relative z-50 w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl"
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

              {/* Encabezado */}
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

              {/* Grid de info rápida */}
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
};

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

export default LatestLaunchesTable;