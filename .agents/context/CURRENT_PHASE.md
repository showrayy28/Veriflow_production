# VeriFlow Web 2.0 — Current Build Phase

## Status: Phases 0 through 10 COMPLETE (Production-Ready Flagship)

### Completed Phases
- [x] **Phase 0: Pre-Migration & Legacy Cleanup** — Branch created (`v2-web-migration`), legacy React Native & MongoDB files removed, `.gitignore` configured.
- [x] **Phase 1: PostgreSQL Relational Database** — `schema.sql` (4 tables: users, plots, satellite_reports, nft_credits), `seed.sql`, dual PostgreSQL pool & in-memory fallback store.
- [x] **Phase 2: Express.js Backend & Remote Sensing Engine** — JWT auth, plot CRUD, zero-image NASA POWER Earth Observation MRV engine, IPFS Pinata service, marketplace sync, and automated integration tests.
- [x] **Phase 3: Solidity Smart Contract (Polygon Amoy)** — `VeriFlowCarbonNFT.sol` (OpenZeppelin v5) with ERC-721 URI storage, contract escrow, payable `purchaseCredit` with direct farmer payout, `retireCredit` for ESG offset, all 8 Hardhat unit tests passing, ABI exported to frontend.
- [x] **Phase 4: React.js (Vite) Frontend Foundation** — Obsidian & Bioluminescent Emerald design system, Tailwind CSS tokens, `GlassCard`, `StatusBadge`, `Navbar` with 1-click evaluator role switcher.
- [x] **Phase 5: Interactive Satellite Map & Farmer Portal** — React-Leaflet with Esri World Imagery tiles, click-to-capture GPS, browser GPS detection, plot registration form, and Farmer dashboard.
- [x] **Phase 6: Admin MRV Verification Studio & Telemetry Charts** — Verification queue, one-click satellite analysis trigger, 3-panel Recharts gauges (NDVI RadialBar, AGB/BGB/SOC stacked bar, 5-year sequestration curve).
- [x] **Phase 7: Web3 Integration (Ethers.js v6 + MetaMask)** — Browser `window.ethereum` signer, Polygon Amoy network auto-switching, live 4-step `TransactionModal` with confetti, plus resilient simulated signer fallback for evaluators without MetaMask.
- [x] **Phase 8: Carbon Credit Marketplace & ESG Retirement** — Marketplace listings, filters, on-chain purchase flow, permanent ESG retirement, and printable gold-bordered ESG Carbon Offset Certificate.
- [x] **Phase 9: Production Readiness & Build Verification** — Both backend integration test suite and frontend Vite production bundle (`npm run build`) passing with zero errors.
- [x] **Phase 10: Documentation & Git Commit** — Full architecture blueprint, mathematical formulations, and quick-start instructions documented in `README.md`.

### Last Updated
2026-11-02
