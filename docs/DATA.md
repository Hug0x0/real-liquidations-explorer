# Liquidation data

The explorer reads public liquidation events and market metadata from the REAL indexer. It prefers an explicit position notional when present. Otherwise it estimates notional from position size and event price, liquidation price, or the latest market price in that order.

Multi-position liquidations appear as one event because they share a liquidation ID. Account links apply an address filter without requesting signing permissions or private keys.
