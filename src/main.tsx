import React, { useEffect, useMemo, useState } from "react"; import { createRoot } from "react-dom/client"; import { RealIndexer } from "./api"; import { EventCard } from "./EventCard"; import { enrich, filterLiquidations } from "./liquidations"; import { demoLiquidations, demoMarkets } from "./mock"; import type { Liquidation, Market } from "./types"; import "./styles.css";
const REFRESH_MS = 30_000;
const clock = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
function App() { const [markets, setMarkets] = useState<Market[]>([]); const [events, setEvents] = useState<Liquidation[]>([]); const [marketId, setMarketId] = useState(""); const [minimum, setMinimum] = useState(0); const [account, setAccount] = useState(new URLSearchParams(location.search).get("account") || ""); const [live, setLive] = useState(false); const [stale, setStale] = useState(false); const [updatedAt, setUpdatedAt] = useState<number>();
  useEffect(() => {
    const api = new RealIndexer(); let active = true; let loaded = false;
    const load = () => Promise.allSettled([api.markets(), api.liquidations()]).then(([m, e]) => {
      if (!active) return;
      if (e.status === "fulfilled") {
        // Live events stay usable without market metadata: symbols fall back to IDs and notional uses event prices.
        if (m.status === "fulfilled") setMarkets(m.value);
        setEvents(e.value); setLive(true); setStale(false); setUpdatedAt(Date.now()); loaded = true;
      } else if (loaded) setStale(true);
      else { setMarkets(demoMarkets); setEvents(demoLiquidations); }
    });
    load(); const timer = window.setInterval(load, REFRESH_MS);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  const symbols = useMemo(() => new Map(markets.map((m) => [m.id, m.symbol])), [markets]); const prices = useMemo(() => new Map(markets.map((m) => [m.id, Number(m.price)])), [markets]); const enriched = useMemo(() => events.map((e) => enrich(e, prices)).sort((a, b) => b.created_at_ms - a.created_at_ms), [events, prices]); const visible = useMemo(() => filterLiquidations(enriched, marketId, minimum, account), [enriched, marketId, minimum, account]); const total = visible.reduce((sum, item) => sum + item.notional, 0);
  return <><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content"><nav><b>REAL // LIQUIDATIONS</b><span aria-live="polite">{live ? stale ? "LIVE FEED · REFRESH FAILED" : "LIVE FEED" : "DEMO FEED"}{updatedAt && ` · UPDATED ${clock.format(updatedAt)}`}</span></nav><header><div><span>PUBLIC MARKET INTELLIGENCE</span><h1>Liquidation<br/>tape</h1></div><div className="summary"><small>VISIBLE EVENTS</small><strong>{visible.length}</strong><small>VISIBLE NOTIONAL</small><strong>${Math.round(total).toLocaleString("en-US")}</strong></div></header><section className="filters"><label>Market<select value={marketId} onChange={(e) => setMarketId(e.target.value)}><option value="">All markets</option>{markets.map((m) => <option key={m.id} value={m.id}>{m.symbol}</option>)}</select></label><label>Minimum notional<input type="number" value={minimum} min="0" step="1000" onChange={(e) => setMinimum(Number(e.target.value))}/></label><label>Account contains<input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="0x…"/></label></section><section className="events">{visible.map((item) => <EventCard key={item.liquidation_id} item={item} symbols={symbols}/>)}{!visible.length && <div className="empty" aria-live="polite">No liquidations match these filters.</div>}</section></main></>; }
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
