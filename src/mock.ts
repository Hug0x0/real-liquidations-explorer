import type { Liquidation, Market } from "./types";
export const demoMarkets: Market[] = [{ id: "btc", symbol: "BTC-PERP", price: "68120" }, { id: "eth", symbol: "ETH-PERP", price: "3545" }, { id: "sol", symbol: "SOL-PERP", price: "166" }];
export const demoLiquidations: Liquidation[] = [
  { liquidation_id: 1042, account_id: "0x75b67b5236f497aae73a", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 42000, positions: [{ market_id: "btc", direction: "Long", size: "0.84", price: "67892" }] },
  { liquidation_id: 1041, account_id: "0x18ccad27a994723b035a", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 180000, positions: [{ market_id: "eth", direction: "Short", size: "7.2", price: "3561" }, { market_id: "sol", direction: "Short", size: "41", price: "168" }] },
  { liquidation_id: 1040, account_id: "0xc935a2054eb82a61cc91", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 520000, positions: [{ market_id: "sol", direction: "Long", size: "62", price: "164" }] },
];
