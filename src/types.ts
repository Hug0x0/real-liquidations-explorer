export type Market = { id: string; symbol: string; price: string };
export type LiquidationPosition = { market_id?: string; market?: string; direction?: string; side?: string; size?: string; liquidated_position_size?: string; volume?: string; quantity?: string; price?: string; liquidation_price?: string; notional?: string; status?: string };
export type Liquidation = { liquidation_id: number; account_id: string; liquidator_id: string; positions: LiquidationPosition[]; created_at_ms: number };
export type EnrichedLiquidation = Liquidation & { notional: number; marketIds: string[]; directions: string[] };
