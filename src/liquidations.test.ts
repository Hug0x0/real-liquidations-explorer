import { describe, expect, it } from "vitest"; import { enrich, filterLiquidations, positionNotional } from "./liquidations";
const item = { liquidation_id: 1, account_id: "0xabc", liquidator_id: "0xdef", created_at_ms: 0, positions: [{ market_id: "btc", size: "2", price: "100", direction: "Long" }] };
describe("liquidation analytics", () => { it("calculates notional", () => expect(positionNotional(item.positions[0], new Map())).toBe(200)); it("enriches markets and directions", () => expect(enrich(item).marketIds).toEqual(["btc"])); it("filters by minimum", () => expect(filterLiquidations([enrich(item)], "", 201)).toHaveLength(0)); });


describe("new market support", () => {
  const hypeId = "0x7fa781f5e1d1da7165cf96e5a6898235f55f2d812dd429d3feed69ff776dfa70";
  const solId = "0xca22f2b22f8c16be70d29e5cc8434bedb778c51d6cb224b64c3ee7d152567936";
  const prices = new Map([[hypeId, 75], [solId, 100]]);
  const hype = enrich({ ...item, liquidation_id: 2, positions: [{ market_id: hypeId, liquidated_position_size: "2" }] }, prices);
  const sol = enrich({ ...item, liquidation_id: 3, positions: [{ market_id: solId, liquidated_position_size: "3" }] }, prices);

  it("values indexed HYPE and SOL sizes using their own market prices", () => {
    expect(hype.notional).toBe(150);
    expect(sol.notional).toBe(300);
  });

  it("filters HYPE and SOL independently and applies the notional threshold", () => {
    expect(filterLiquidations([hype, sol], hypeId, 150)).toEqual([hype]);
    expect(filterLiquidations([hype, sol], hypeId, 151)).toEqual([]);
    expect(filterLiquidations([hype, sol], solId, 300)).toEqual([sol]);
  });
});


describe.each([
  ["XRP-USDT", "0xc314a4bc10a6937259f74d480ced63f55add6de39b13b983eea74bbb319c6d98", "8000", 1.25, 10000],
  ["XAUT-USDT", "0x16e576efa4a6f5e27380390c100196c91f89abc5e07307d0e342ed0e61823cd6", "0.5", 3900, 1950],
] as const)("%s market support", (_symbol, marketId, size, price, expected) => {
  it("uses the matching market price for indexed position sizes", () => {
    const event = enrich({ ...item, positions: [{ market_id: marketId, liquidated_position_size: size }] }, new Map([[marketId, price], ["btc", 80000]]));
    expect(event.notional).toBe(expected);
    expect(filterLiquidations([enrich(item), event], marketId, expected)).toEqual([event]);
    expect(filterLiquidations([event], marketId, expected + 1)).toEqual([]);
  });
});
