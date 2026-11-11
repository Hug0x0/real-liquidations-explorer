# Architecture and maintenance

## Overview

The explorer is a client-side React application built with TypeScript and Vite. It has no backend, database, authentication layer, or wallet integration. The browser talks directly to the configured indexer.

```text
REAL indexer → API client → market and event state
                                  ↓
                        enrichment and sorting
                                  ↓
                          local UI filters
                                  ↓
                       summary and event cards

Liquidation request failure (first load) → demo fixtures → same enrichment and UI
```

## Source map

| File | Responsibility |
| --- | --- |
| `index.html` | Page metadata, font loading, and application entry point. |
| `src/main.tsx` | Data loading, application state, filters, totals, and page layout. |
| `src/api.ts` | API base URL and collection requests. |
| `src/types.ts` | Expected market, position, liquidation, and enriched-event types. |
| `src/liquidations.ts` | Position valuation, event enrichment, and filtering. |
| `src/EventCard.tsx` | Timestamp, notional, markets, directions, and account link. |
| `src/mock.ts` | Synthetic fallback markets and liquidation events. |
| `src/styles.css` | Theme, responsive layout, focus indicators, and reduced-motion rules. |
| `src/liquidations.test.ts` | Unit tests for selected analytics behavior. |
| `.github/workflows/ci.yml` | Install, test, and build checks on Node.js 24.22.1. |

## State and lifecycle

`App` loads both collections in a mount effect using `Promise.allSettled`, then repeats every 30 seconds. Responses that arrive after unmount are ignored. React Strict Mode is enabled, so development mode can run the effect more than once. A failed refresh after live data loaded keeps the previous events and shows `REFRESH FAILED`.

Market symbol and price maps, enriched events, and filtered results are derived with `useMemo`. The summary is calculated from the visible events. Filter changes do not make API requests.

The initial state has no events and displays `DEMO FEED`; there is no separate loading UI. A successful liquidation request sets the live flag, even if market metadata fails. A first-load liquidation failure loads fixtures without showing a detailed error message.

## Build and external services

`npm run build` runs `tsc` followed by `vite build`. TypeScript uses strict mode and excludes test files from this application type-check step. Vitest runs the test files separately.

The production output is a static `dist/` directory. Environment configuration is embedded at build time. The page loads fonts from Google Fonts, and data comes from the configured API; the application has no bundled analytics integration.

## Troubleshooting

| Symptom | What to inspect |
| --- | --- |
| The page remains in demo mode | Check browser network requests for API errors, CORS failures, or JSON parsing failures. Only a liquidation-request failure on first load activates fallback data. |
| A live feed is empty | Clear filters and inspect the returned liquidation array. Empty successful results do not trigger demo mode. |
| An event shows an unexpected amount | Inspect its position fields and price fallbacks in [data semantics](DATA.md). Multi-market events retain their full total. |
| Data does not change | The feed refreshes every 30 seconds; check the timestamp and `REFRESH FAILED` label in the navigation bar. |
| A custom API URL is ignored | Restart Vite after development configuration changes; rebuild and redeploy production assets after build-time configuration changes. |
| Invalid data breaks rendering | Compare the response with `src/types.ts`; the client has no runtime schema validation. |

## Areas for future work

Potential improvements include explicit loading and error states, runtime response validation, pagination decimal-safe valuation, and broader test coverage. These are opportunities, not implemented features or release commitments.
