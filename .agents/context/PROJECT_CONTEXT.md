# VeriFlow Web 2.0 — Project Context

## What Is VeriFlow?

VeriFlow is a **decentralized Blue Carbon MRV (Measurement, Reporting, Verification) Registry** 
and **Web3 Carbon Credit Marketplace**. It enables coastal farmers to register mangrove plantation 
plots via GPS coordinates on a satellite map, automates carbon sequestration calculation using 
satellite remote sensing (NDVI + IPCC Tier-2 Allometry), tokenizes verified carbon credits as 
ERC-721 NFTs on Polygon blockchain, and allows buyers to purchase and retire credits with MATIC.

## The 5-Stage Pipeline

```
SUBMITTED → VERIFIED → MINTED → SOLD → RETIRED
```

1. **SUBMITTED** — Farmer registers a plot with GPS coordinates + mangrove species
2. **VERIFIED** — Admin runs satellite remote sensing, computes NDVI, AGB, BGB, SOC, tCO2e
3. **MINTED** — Admin pins metadata to IPFS, mints ERC-721 NFT on Polygon Amoy
4. **SOLD** — Buyer purchases credit with MATIC, farmer receives payment
5. **RETIRED** — Buyer retires credit for ESG compliance, receives certificate

## Three User Roles

| Role | Description |
|------|-------------|
| **Farmer** | Registers mangrove plots via satellite map, receives MATIC payouts |
| **Admin (MRV Auditor)** | Runs satellite verification, mints NFTs |
| **Buyer (Corporate ESG)** | Purchases and retires carbon credits |

## Key Differentiators

- **Zero-Image Verification** — No drone photos needed, only GPS coordinates
- **Satellite Remote Sensing** — NASA POWER API + deterministic geospatial fallback
- **IPCC-Grounded Science** — Published allometric equations, not black-box ML
- **On-Chain Carbon Credits** — ERC-721 NFTs with IPFS-pinned satellite proofs
- **Instant Farmer Payout** — Smart contract forwards MATIC directly to farmer wallet
