// components/launches/LaunchDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDate, statusLabel, statusPillClasses } from "@/lib/ui-helper";
import Image from "next/image";

interface Props {
  launch: Launch | null;
  onClose: () => void;
}

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

export function LaunchDetailModal({ launch, onClose }: Props) {
  return (
    <AnimatePresence>
      {launch && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative z-50 w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-800 text-slate-200 hover:bg-red-700 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-start gap-3 pb-4">
              {launch.patch_large && (
                <Image
                  src={launch.patch_large}
                  width={24}
                  height={24}
                  alt={launch.mission_name ?? "Patch"}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 object-contain"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-50">
                  {launch.mission_name || "Unnamed mission"}
                </h3>
                <p className="text-xs text-slate-400">
                  Launch ID: {launch.launch_id}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium " +
                      statusPillClasses[launch.status ?? "unknown"]
                    }
                  >
                    {statusLabel[launch.status ?? "unknown"]}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-200">
                    {formatDate(launch.date_utc, launch.date_local)}
                  </span>
                  {launch.flight_number != null && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-200">
                      Flight #{launch.flight_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid info rápida */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <InfoBadge label="Rocket ID">
                {launch.rocket_id ?? "—"}
              </InfoBadge>
              <InfoBadge label="Launchpad ID">
                {launch.launchpad_id ?? "—"}
              </InfoBadge>
              <InfoBadge label="Upcoming">
                {launch.upcoming == null
                  ? "Unknown"
                  : launch.upcoming
                  ? "Yes"
                  : "No"}
              </InfoBadge>
              <InfoBadge label="Success">
                {launch.success == null
                  ? "Unknown"
                  : launch.success
                  ? "Yes"
                  : "No"}
              </InfoBadge>
            </div>

            {/* Detalles / descripción */}
            {launch.details && (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Mission details
                </div>
                <p className="text-sm leading-relaxed">{launch.details}</p>
              </div>
            )}

            {/* Links externos */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {launch.article && (
                <a
                  href={launch.article}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                >
                  📰 <span>Open article</span>
                </a>
              )}
              {launch.webcast && (
                <a
                  href={launch.webcast}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                >
                  📺 <span>Watch webcast</span>
                </a>
              )}
              {launch.wikipedia && (
                <a
                  href={launch.wikipedia}
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
  );
}