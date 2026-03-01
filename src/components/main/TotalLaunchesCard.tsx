"use client";

import { useLaunchesStore } from "@/store/useLaunches";
import React from "react";

const TotalLaunchesCard: React.FC = () => {
  // Leemos lo que antes venía por props
  const summary = useLaunchesStore((state) => state.globalSummary);
  const loading = useLaunchesStore((state) => state.loadingSummary);

  const total = summary?.total ?? 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/90 px-4 py-6 shadow-2xl sm:px-6 sm:py-8 md:px-8 md:py-10">
      {/* 🌌 Glow de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_60%)]" />

      {/* 🚀 Cohete de fondo (responsive) */}
      <div className="pointer-events-none absolute inset-y-0 -right-10 flex items-center justify-center sm:-right-15 md:-right-20">
        <span
          className="
            text-[130px]
            sm:text-[180px]
            md:text-[240px]
            opacity-20
            md:opacity-10
            blur-[1px]
            select-none
            drop-shadow-[0_0_60px_rgba(56,189,248,0.6)]
          "
        >
          🚀
        </span>
      </div>

      {/* 🎯 Contenido */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Texto izquierda */}
        <div className="max-w-xl">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
            Mission Control
          </span>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            SpaceX Launches
          </h1>

          <p className="mt-2 text-xs text-slate-400 sm:text-sm md:text-base">
            SpaceX launch intelligence — real-time data, every mission.
          </p>
        </div>

        {/* Número derecha (o abajo en mobile) */}
        <div className="mt-3 flex flex-col items-start sm:items-start md:mt-0 md:items-end">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-4xl font-bold tracking-tight text-sky-400 sm:text-5xl md:text-6xl">
              {loading ? "…" : total.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
              total launches
            </span>
          </div>
          {summary && (
            <span className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              Updated from API in real time.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalLaunchesCard;