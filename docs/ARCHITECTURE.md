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

Request failure → demo fixtures → same enrichment and UI
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

`App` loads both collections in a mount effect using `Promise.all`. React Strict Mode is enabled, so development mode can run the effect more than once. There is no request cancellation, retry loop, refresh timer, or stale-data indicator.

Market symbol and price maps, enriched events, and filtered results are derived with `useMemo`. The summary is calculated from the visible events. Filter changes do not make API requests.

The initial state has no events and displays `DEMO FEED`; there is no separate loading UI. Successful requests set the live flag. Request failures load fixtures without showing a detailed error message.

## Build and external services

`npm run build` runs `tsc` followed by `vite build`. TypeScript uses strict mode and excludes test files from this application type-check step. Vitest runs the test files separately.

The production output is a static `dist/` directory. Environment configuration is embedded at build time. The page loads fonts from Google Fonts, and data comes from the configured API; the application has no bundled analytics integration.

## Troubleshooting

| Symptom | What to inspect |
| --- | --- |
| The page remains in demo mode | Check browser network requests for API errors, CORS failures, or JSON parsing failures. Either collection failing activates fallback data. |
| A live feed is empty | Clear filters and inspect the returned liquidation array. Empty successful results do not trigger demo mode. |
| An event shows an unexpected amount | Inspect its position fields and price fallbacks in [data semantics](DATA.md). Multi-market events retain their full total. |
| Data does not change | Reload the page. Automatic refresh is not implemented. |
| A custom API URL is ignored | Restart Vite after development configuration changes; rebuild and redeploy production assets after build-time configuration changes. |
| Invalid data breaks rendering | Compare the response with `src/types.ts`; the client has no runtime schema validation. |

## Areas for future work

Potential improvements include explicit loading and error states, runtime response validation, pagination, manual refresh, decimal-safe valuation, and broader test coverage. These are opportunities, not implemented features or release commitments.
