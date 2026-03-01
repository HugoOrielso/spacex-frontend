"use client";

import { create } from "zustand";
import { getByYear, getLaunches, getSummary } from "@/lib/api/client";

const PAGE_SIZE = 50;

type LaunchesStatus = LaunchFilters["status"] | "all";

type LaunchesStats = {
  total: number;
  success: number;
  failed: number;
  upcoming: number;
  unknown: number;
};

interface LaunchesState {
  launches: Launch[];
  years: number[];
  byYear: YearStat[];
  latestLaunches: Launch[];

  loading: boolean;
  loadingSummary: boolean;
  loadingYear: boolean;
  loadingLatest: boolean;

  error: string | null;

  status: LaunchesStatus;
  year: number | "all";
  search: string;
  page: number;
  hasMore: boolean;

  globalSummary: Summary | null;
  stats: LaunchesStats;

  // Inicialización / dashboard
  init: () => Promise<void>;
  initDashboard: () => Promise<void>;

  // Listado paginado
  fetchLaunches: () => Promise<void>;
  setStatus: (s: LaunchesStatus) => void;
  setYear: (y: number | "all") => void;
  setSearch: (s: string) => void;
  resetFilters: () => void;
  nextPage: () => void;
  prevPage: () => void;
}

function computeStats(launches: Launch[]): LaunchesStats {
  const base: LaunchesStats = {
    total: launches.length,
    success: 0,
    failed: 0,
    upcoming: 0,
    unknown: 0,
  };

  for (const l of launches) {
    const s = l.status ?? "unknown";
    if (s === "success") base.success++;
    else if (s === "failed") base.failed++;
    else if (s === "upcoming") base.upcoming++;
    else base.unknown++;
  }

  return base;
}

export const useLaunchesStore = create<LaunchesState>((set, get) => ({
  launches: [],
  years: [],
  byYear: [],
  latestLaunches: [],

  loading: false,
  loadingSummary: false,
  loadingYear: false,
  loadingLatest: false,

  error: null,

  status: "all",
  year: "all",
  search: "",
  page: 1,
  hasMore: false,

  globalSummary: null,
  stats: {
    total: 0,
    success: 0,
    failed: 0,
    upcoming: 0,
    unknown: 0,
  },

  // 🔹 init “general” (por si ya lo usas en otra vista tipo explorer)
  init: async () => {
    try {
      set({ loading: true, error: null });

      const [yearStats, summary] = await Promise.all([
        getByYear(),
        getSummary(),
      ]);

      const years = yearStats.map((y) => y.year).sort((a, b) => a - b);

      set({
        years,
        byYear: yearStats,
        globalSummary: summary,
      });

      await get().fetchLaunches();
    } catch (e) {
      console.error(e);
      set({ error: "Error inicializando Launch Explorer" });
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 init específico para el dashboard de HomePage
  initDashboard: async () => {
    try {
      set({
        error: null,
        loadingSummary: true,
        loadingYear: true,
        loadingLatest: true,
      });

      const latestFilters: LaunchFilters = { limit: 5, offset: 0 };

      const [summary, byYearData, latestLaunches] = await Promise.all([
        getSummary(),
        getByYear(),
        getLaunches(latestFilters),
      ]);

      const years = byYearData.map((y) => y.year).sort((a, b) => a - b);

      set({
        globalSummary: summary,
        byYear: byYearData,
        years,
        latestLaunches,
      });
    } catch (e) {
      console.error(e);
      set({ error: "Error fetching statistics from API" });
    } finally {
      set({
        loadingSummary: false,
        loadingYear: false,
        loadingLatest: false,
      });
    }
  },

  fetchLaunches: async () => {
    try {
      set({ loading: true, error: null });

      const { status, year, search, page } = get();

      const filters: LaunchFilters = {
        status: status !== "all" ? status : undefined,
        year: year !== "all" ? Number(year) : undefined,
        search: search.trim() || undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      };

      const data = await getLaunches(filters);
      const stats = computeStats(data);

      set({
        launches: data,
        hasMore: data.length === PAGE_SIZE,
        stats,
      });
    } catch (e) {
      console.error(e);
      set({ error: "Error fetching launches from API" });
    } finally {
      set({ loading: false });
    }
  },

  setStatus: (s) => {
    set({ status: s, page: 1 });
    get().fetchLaunches();
  },

  setYear: (y) => {
    set({ year: y, page: 1 });
    get().fetchLaunches();
  },

  setSearch: (s) => {
    set({ search: s, page: 1 });
    get().fetchLaunches();
  },

  resetFilters: () => {
    set({ status: "all", year: "all", search: "", page: 1 });
    get().fetchLaunches();
  },

  nextPage: () => {
    const { page, hasMore, loading } = get();
    if (!hasMore || loading) return;
    set({ page: page + 1 });
    get().fetchLaunches();
  },

  prevPage: () => {
    const { page, loading } = get();
    if (page <= 1 || loading) return;
    set({ page: page - 1 });
    get().fetchLaunches();
  },
}));