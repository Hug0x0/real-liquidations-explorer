import { describe, expect, it } from "vitest";
import { normalizeLiquidation } from "./api";

describe("normalizeLiquidation", () => {
  it("maps the current indexer liquidation schema to a displayable position", () => {
    expect(normalizeLiquidation({
      liquidation_id: 116,
      account_id: "0xaccount",
      created_at_ms: 1794380616661,
      market_id: "zec",
      mark_price: "966.82",
      position_before: { direction: "Long", size: "0.032" },
      outcome: "Takeover",
      outcome_detail: { liquidator_id: "0xliquidator", size: "0.032", price: "966.82" },
    })).toEqual({
      liquidation_id: 116,
      account_id: "0xaccount",
      liquidator_id: "0xliquidator",
      created_at_ms: 1794380616661,
      positions: [{ market_id: "zec", direction: "Long", size: "0.032", price: "966.82" }],
    });
  });

  it("preserves the legacy nested positions schema", () => {
    const event = { liquidation_id: 1, account_id: "0xaccount", liquidator_id: "0xliquidator", created_at_ms: 1, positions: [{ market_id: "btc", size: "1" }] };
    expect(normalizeLiquidation(event)).toBe(event);
  });
});
