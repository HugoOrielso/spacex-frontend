import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
});

export const getLaunches = async (filters: LaunchFilters = {}): Promise<Launch[]> => {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.year) params.year = filters.year;
  if (filters.search) params.search = filters.search;
  if (filters.limit) params.limit = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  const { data } = await api.get<Launch[]>("/launches", { params });
  return data;
};

export const getLaunchById = async (id: string): Promise<Launch> => {
  const { data } = await api.get<Launch>(`/launches/${id}`);
  return data;
};

export const getSummary = async (): Promise<Summary> => {
  const { data } = await api.get<Summary>("/stats/summary");
  return data;
};

export const getByYear = async (): Promise<YearStat[]> => {
  const { data } = await api.get<YearStat[]>("/stats/by-year");
  return data;
};