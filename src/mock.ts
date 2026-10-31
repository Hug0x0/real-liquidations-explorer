import type { Liquidation, Market } from "./types";
export const demoMarkets: Market[] = [{ id: "btc", symbol: "BTC-USDT", price: "68120" }, { id: "eth", symbol: "ETH-USDT", price: "3545" }, { id: "sol", symbol: "SOL-USDT", price: "166" }, { id: "hype", symbol: "HYPE-USDT", price: "75" }, { id: "xrp", symbol: "XRP-USDT", price: "1.25" }, { id: "xaut", symbol: "XAUT-USDT", price: "3900" }];
export const demoLiquidations: Liquidation[] = [
  { liquidation_id: 1045, account_id: "0x81aa23456bcdef123456", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 5000, positions: [{ market_id: "xrp", direction: "Long", size: "8000", price: "1.25" }] },
  { liquidation_id: 1044, account_id: "0x92bb23456bcdef123456", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 10000, positions: [{ market_id: "xaut", direction: "Short", size: "2", price: "3900" }] },
  { liquidation_id: 1043, account_id: "0x93ef028d631ab93c7201", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 15000, positions: [{ market_id: "hype", direction: "Long", size: "120", price: "75" }] },
  { liquidation_id: 1042, account_id: "0x75b67b5236f497aae73a", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 42000, positions: [{ market_id: "btc", direction: "Long", size: "0.84", price: "67892" }] },
  { liquidation_id: 1041, account_id: "0x18ccad27a994723b035a", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 180000, positions: [{ market_id: "eth", direction: "Short", size: "7.2", price: "3561" }, { market_id: "sol", direction: "Short", size: "41", price: "168" }] },
  { liquidation_id: 1040, account_id: "0xc935a2054eb82a61cc91", liquidator_id: "0xbackstop", created_at_ms: Date.now() - 520000, positions: [{ market_id: "sol", direction: "Long", size: "62", price: "164" }] },
];
