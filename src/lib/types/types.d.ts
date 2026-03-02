interface Launch {
  launch_id: string;
  mission_name?: string | null;
  flight_number?: number | null;
  date_utc?: string | null;
  date_local?: string | null;
  status?: "success" | "failed" | "upcoming" | "unknown";
  upcoming?: boolean | null;
  success?: boolean | null;
  details?: string | null;
  launchpad_id?: string | null;
  rocket_id?: string | null;
  article?: string | null;
  webcast?: string | null;
  wikipedia?: string | null;
  patch_small?: string | null;
  patch_large?: string | null;
}

interface Summary {
  total: number;
  success: number;
  failed: number;
  upcoming: number;
  unknown: number;
}

interface YearStat {
  year: number;
  total: number;
  success: number;
  failed: number;
  upcoming: number;
}

interface LaunchFilters {
  status?: string;
  year?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

interface LaunchesStats {
  total: number;
  success: number;
  failed: number;
  upcoming: number;
  unknown: number;
};