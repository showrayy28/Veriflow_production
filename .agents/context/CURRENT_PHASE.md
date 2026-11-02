# VeriFlow Web 2.0 — Current Build Phase

## Status: Phase 1 & 2 COMPLETE → Starting Phase 3

### Completed Phases
- [x] **Phase 0: Pre-Migration & Legacy Cleanup** — Branch created, all React Native/MongoDB code deleted, .gitignore updated, context memory files created.
- [x] **Phase 1: PostgreSQL Database Setup** — `schema.sql` (4 tables: users, plots, satellite_reports, nft_credits), `seed.sql`, dual PostgreSQL pool & in-memory fallback.
- [x] **Phase 2: Express.js Backend & Remote Sensing Engine** — Auth, Plots, MRV Satellite Engine (NASA POWER + IPCC Tier-2), Pinata IPFS service, Marketplace sync, and integration test suite.

### Current Phase
- [ ] **Phase 3: Solidity Smart Contract Upgrade & Deployment** — Hardhat workspace, `VeriFlowCarbonNFT.sol` with ERC-721 URI storage, escrow, `purchaseCredit` (payable), `retireCredit`, unit tests, and Polygon Amoy config.

### Upcoming Phases
- [ ] Phase 4: React Vite Frontend Foundation
- [ ] Phase 5: Interactive Satellite Map & Farmer Portal
- [ ] Phase 6: Admin MRV Verification Studio & Charts
- [ ] Phase 7: Ethers.js v6 Blockchain Wiring
- [ ] Phase 8: Carbon Credit Marketplace & ESG Retirement
- [ ] Phase 9: Cloud Deployment
- [ ] Phase 10: Polish, Security & Merge

### Last Updated
2026-11-02
