const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export type AvailabilityItem = { quota: string; status: string; last_updated: string };
export type AvailabilityResponse = { train_no: string; date: string; class: string; availability: AvailabilityItem[] };
export type PredictResponse = { confirmation_chance: number; top_factors: string[]; input: any; features?: any };
export type PnrHistory = { status: string; time: string };
export type PnrResponse = { pnr: string; current_status: string; history: PnrHistory[]; coach?: string; berth?: string };
export type RouteStation = { code: string; name: string; lat: number; lng: number };
export type RouteResponse = { train_no: string; stations: RouteStation[] };
export type NotifyResponse = { success: boolean };
export type ReliabilityBucket = { bucket: number; avg_prob: number | null; count: number };
export type ReliabilityResponse = { buckets: ReliabilityBucket[]; brier: number | null };
export type TrendsResponse = { train_no: string; clazz: string; monthly: { month: string; avg_prob: number }[]; wl_vs_prob: { wl: number; prob: number }[] };

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export const Api = {
  availability: (params: { train_no: string; date: string; clazz: string }) =>
    apiGet<AvailabilityResponse>(`/availability?train_no=${params.train_no}&date=${params.date}&clazz=${params.clazz}`),
  predict: (payload: { train_no: string; source: string; destination: string; date: string; clazz: string; quota_type: string; wl_position: number }) =>
    apiPost<PredictResponse>('/predict', payload),
  pnr: (pnr: string) => apiGet<PnrResponse>(`/pnr/${pnr}`),
  route: (train_no: string) => apiGet<RouteResponse>(`/route/${train_no}`),
  notify: (payload: { channel: string; recipient: string; message: string }) => apiPost<NotifyResponse>('/notify', payload),
  reliability: () => apiGet<ReliabilityResponse>('/metrics/reliability'),
  trends: (params: { train_no: string; clazz: string; month?: string }) =>
    apiGet<TrendsResponse>(`/trends?train_no=${params.train_no}&clazz=${params.clazz}${params.month ? `&month=${params.month}` : ''}`),
};
