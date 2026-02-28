/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/ui-helpers.ts

export const statusLabel: Record<any, string> = {
  success: "Success",
  failed: "Failed",
  upcoming: "Upcoming",
  unknown: "Unknown",
};

export const statusPillClasses: Record<any, string> = {
  success:
    "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
  failed: "bg-rose-500/10 text-rose-300 border border-rose-500/40",
  upcoming:
    "bg-sky-500/10 text-sky-300 border border-sky-500/40",
  unknown:
    "bg-slate-500/10 text-slate-300 border border-slate-500/40",
};

export const formatDate = (utc?: string | null, local?: string | null) => {
  const raw = utc || local;
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString();
};

export const shortId = (id: string) =>
  id.length > 10 ? id.slice(0, 10) + "…" : id;