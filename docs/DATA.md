# Data sources and calculations

This document describes the current client implementation, not a guarantee about the upstream API. Request logic lives in [`src/api.ts`](../src/api.ts); calculations and filters live in [`src/liquidations.ts`](../src/liquidations.ts).

## Requests

The default base URL is `https://indexer.api.real.xyz`, configurable with `VITE_REAL_API_URL`.

| Resource | Request path | Requested page size |
| --- | --- | --- |
| Markets | `/api/v1/markets?p[s]=200` | 200 |
| Liquidations | `/api/v1/liquidations?p[s]=250` | 250 |

Requests are unauthenticated browser GET requests. The client accepts a top-level array or the response's `data` property, defaulting to an empty array when `data` is absent. It does not follow pagination or validate response records at runtime.

Both requests are repeated every 30 seconds. The liquidation request decides the data source: if it succeeds, live events are shown even when market metadata fails (symbols then fall back to market identifiers). If the first liquidation request is rejected, returns a non-success HTTP status, or cannot be parsed, both datasets switch to the fixtures in [`src/mock.ts`](../src/mock.ts). Later failures keep the last live data. A successful empty response produces an empty live feed, not demo data. Malformed records can still cause rendering errors because TypeScript types do not validate network responses.

## Expected records

The client types are defined in [`src/types.ts`](../src/types.ts).

| Record | Fields used |
| --- | --- |
| Market | `id`, `symbol`, `price` |
| Liquidation | `liquidation_id`, `account_id`, `market_id`, `position_before`, `outcome_detail`, `created_at_ms` |
| Position | Market, direction, size, price, and notional fields described below |

The indexer currently returns one market per liquidation at the top level. The client normalizes it into the legacy `positions` shape using `market_id`, the direction from `position_before`, and the size and price from `outcome_detail` (falling back to `position_before.size` and `mark_price`). `liquidator_id` is included in the normalized type but is not displayed. Timestamps are interpreted as Unix milliseconds. Unknown market symbols fall back to the market identifier.

## Position notional

The current calculation is:

```text
nonzero numeric position.notional
  OR
numeric position size × numeric selected price
```

The fallback field order is:

| Value | First non-nullish field, in priority order |
| --- | --- |
| Size | `size`, `liquidated_position_size`, `volume`, `quantity`, then `0` |
| Market identifier | `market_id`, `market`, then `"unknown"` |
| Price | `price`, `liquidation_price`, latest loaded market price, then `0` |
| Direction label | `direction`, `side`, `status`, then `"unknown"` |

An explicit notional that converts to zero or `NaN` triggers the size-times-price fallback. For the other fields, selection is based on null/undefined checks, not validity: a present but invalid numeric string does not advance to the next field.

Example: a position with size `"2"` and price `"100"` has an estimated notional of $200. An explicit notional of `"250"` takes precedence.

## Event totals and filters

An event's notional is the sum of its position notionals. Market identifiers and direction labels are deduplicated within that event. The client keeps each API record as one card; it does not split positions into separate events or merge duplicate API records.

All active filters must match:

- **Market:** the event contains the selected market identifier.
- **Minimum notional:** the full event notional is greater than or equal to the threshold.
- **Account:** `account_id` contains the search text, ignoring case. Input is not trimmed automatically.

The summary counts matching events and sums their full notionals. For example, an event with $200 in BTC and $100 in ETH still contributes $300 when filtered to BTC.

Account links set `?account=<encoded account identifier>`. That query parameter initializes the account input on page load. No wallet access, signing, or private keys are involved.

## Interpretation limits

- Notional represents position value, not realized loss, collateral, fees, or liquidator profit.
- A latest-market-price fallback is an estimate and may differ from the price at liquidation time.
- Values are displayed as USD; the client performs no currency conversion or unit normalization.
- Calculations use JavaScript `Number`, with floating-point precision limits and no decimal arithmetic library.
- Missing numeric fields may produce zero; malformed numeric fields may produce `NaN`. There is no data-quality warning in the UI.
- The feed covers the returned page only. Sorting that page does not prove completeness of recent activity.
- Displayed money is rounded to whole dollars, while filters use the unrounded value.
- Demo events are synthetic; their timestamps are generated relative to module load time.
