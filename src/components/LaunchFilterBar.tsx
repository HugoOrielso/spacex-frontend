// components/LaunchFiltersBar.tsx
"use client";

import React from "react";

interface Props {
  filters: LaunchFilters;
  onChange: (filters: LaunchFilters) => void;
  years: number[];
  loading: boolean;
}

const LaunchFiltersBar: React.FC<Props> = ({
  filters,
  onChange,
  years,
  loading,
}) => {
  const handleChange = (field: keyof LaunchFilters, value: string) => {
    if (field === "year") {
      onChange({
        ...filters,
        year: value ? Number(value) : undefined,
      });
      return;
    }
    if (field === "status") {
      onChange({
        ...filters,
        status: value || undefined,
      });
      return;
    }
    onChange({ ...filters, [field]: value || undefined });
  };

  const handleReset = () => {
    onChange({
      status: undefined,
      year: undefined,
      search: undefined,
      limit: 50,
      offset: 0,
    });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Status
          </label>
          <select
            className="h-10 rounded-xl border border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 shadow-inner outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            value={filters.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="upcoming">Upcoming</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Year
          </label>
          <select
            className="h-10 rounded-xl border border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 shadow-inner outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            value={filters.year ?? ""}
            onChange={(e) => handleChange("year", e.target.value)}
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex min-w-55 flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Search (mission / id / rocket)
          </label>
          <input
            className="h-10 rounded-xl border border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 shadow-inner outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            placeholder="Type to filter launches…"
            value={filters.search ?? ""}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="h-10 rounded-xl border border-slate-600 bg-slate-900/80 px-4 text-sm font-medium text-slate-200 shadow hover:bg-slate-800 hover:border-slate-500 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={loading}
          className="h-10 rounded-xl bg-sky-500/90 px-5 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading…" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default LaunchFiltersBar;