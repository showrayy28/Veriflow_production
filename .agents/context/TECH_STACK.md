# VeriFlow Web 2.0 — Technology Stack

## Architecture

```
client/  (React.js Vite)  →  server/  (Express.js)  →  PostgreSQL (Neon)
   ↕                            ↕                          ↕
MetaMask (Ethers.js v6)    NASA POWER API            4 relational tables
   ↕                       Pinata IPFS               users → plots → satellite_reports → nft_credits
Polygon Amoy Testnet
```

## Frontend — `client/`
- **Framework:** React 18 with Vite build tool
- **Styling:** Tailwind CSS v3 (Obsidian & Bioluminescent Emerald theme)
- **Routing:** React Router DOM v6
- **Maps:** React-Leaflet + Leaflet.js with Esri World Satellite Imagery tiles
- **Charts:** Recharts (NDVI gauge, biomass bars, carbon projection)
- **Animations:** Framer Motion (page transitions, hover effects)
- **Icons:** Lucide React
- **Web3:** Ethers.js v6 via `window.ethereum` (MetaMask browser extension)
- **HTTP:** Axios
- **State:** React Context API (AuthContext, Web3Context)

## Backend — `server/`
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL via `pg` (node-postgres) connection pool
- **Auth:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Satellite Engine:** NASA POWER API + deterministic geospatial fallback
- **IPFS:** Pinata API for JSON metadata pinning
- **Validation:** express-validator

## Smart Contracts — `contracts/`
- **Language:** Solidity ^0.8.20
- **Standard:** ERC-721 (OpenZeppelin v5) with URI Storage
- **Toolchain:** Hardhat
- **Network:** Polygon Amoy Testnet (Chain ID: 80002 / 0x13882)
- **Functions:** mintCarbonCredit(), purchaseCredit(), retireCredit()

## Database — PostgreSQL (Neon.tech)
- **Tables:** users, plots, satellite_reports, nft_credits
- **Constraints:** Foreign keys, UNIQUE on nft_credits.plot_id, NUMERIC precision
- **Hosting:** Neon.tech serverless PostgreSQL (free tier)

## Deployment
- **Frontend:** Vercel (free tier, auto-deploy from GitHub)
- **Backend:** Render.com (free tier, web service)
- **Database:** Neon.tech (serverless PostgreSQL)
- **Blockchain:** Polygon Amoy Testnet (public testnet)
