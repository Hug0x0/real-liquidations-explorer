import type { Liquidation, Market } from "./types";
type IndexerLiquidation = Omit<Liquidation, "liquidator_id" | "positions"> & {
  liquidator_id?: string;
  positions?: Liquidation["positions"];
  market_id?: string;
  mark_price?: string;
  outcome?: string;
  position_before?: { direction?: string | null; size?: string };
  outcome_detail?: { liquidator_id?: string; size?: string; price?: string };
};

export function normalizeLiquidation(item: IndexerLiquidation): Liquidation {
  if (Array.isArray(item.positions)) return item as Liquidation;

  return {
    liquidation_id: item.liquidation_id,
    account_id: item.account_id,
    liquidator_id: item.liquidator_id ?? item.outcome_detail?.liquidator_id ?? "",
    created_at_ms: item.created_at_ms,
    positions: item.market_id ? [{
      market_id: item.market_id,
      direction: item.position_before?.direction ?? item.outcome,
      size: item.outcome_detail?.size ?? item.position_before?.size,
      price: item.outcome_detail?.price ?? item.mark_price,
    }] : [],
  };
}

export class RealIndexer {
  constructor(private readonly baseUrl = import.meta.env.VITE_REAL_API_URL || "https://indexer.api.real.xyz") {}
  private async list<T>(path: string): Promise<T[]> { const response = await fetch(`${this.baseUrl}${path}`); if (!response.ok) throw new Error(`REAL API ${response.status}`); const body = await response.json(); return Array.isArray(body) ? body : body.data ?? []; }
  markets() { return this.list<Market>("/api/v1/markets?p[s]=200"); }
  async liquidations() { return (await this.list<IndexerLiquidation>("/api/v1/liquidations?p[s]=250")).map(normalizeLiquidation); }
}
