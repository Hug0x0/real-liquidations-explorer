import type { Liquidation, Market } from "./types";
export class RealIndexer {
  constructor(private readonly baseUrl = import.meta.env.VITE_REAL_API_URL || "https://indexer.api.real.xyz") {}
  private async list<T>(path: string): Promise<T[]> { const response = await fetch(`${this.baseUrl}${path}`); if (!response.ok) throw new Error(`REAL API ${response.status}`); const body = await response.json(); return Array.isArray(body) ? body : body.data ?? []; }
  markets() { return this.list<Market>("/api/v1/markets?p[s]=200"); }
  liquidations() { return this.list<Liquidation>("/api/v1/liquidations?p[s]=250"); }
}
