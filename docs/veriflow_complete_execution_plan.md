# VeriFlow Web 2.0 — Complete Analysis & Step-by-Step Execution Plan

> **Project:** Blue Carbon MRV Registry, Satellite Remote Sensing Engine & Polygon ERC-721 Carbon Marketplace  
> **Document Type:** Architectural Audit + Migration Blueprint + Execution Strategy  
> **Date:** 2026-11-02

---

## Part 1: Deep Analysis of the Existing Repository

### 1.1 What VeriFlow Is

VeriFlow is a **decentralized Blue Carbon MRV (Measurement, Reporting, Verification) Registry** and **Web3 Carbon Credit Marketplace** built around coastal mangrove ecosystems. It enables:

1. **Farmers** to register mangrove plantation plots via GPS coordinates
2. **Admins** to verify plots using satellite remote sensing (NDVI, biomass calculations)
3. **Admins** to mint verified carbon credits as ERC-721 NFTs on Polygon blockchain
4. **Buyers** to purchase and retire carbon credits with MATIC payment, receiving ESG certificates

The 5-stage pipeline: `SUBMITTED → VERIFIED → MINTED → SOLD → RETIRED`

### 1.2 Current Technology Stack (Legacy — BROKEN)

| Layer | Current (Broken) | Required (PRD v2.0) |
|-------|------------------|---------------------|
| **Frontend** | React Native (Expo 54) + Metro Bundler | React.js 18 (Vite) + Tailwind CSS |
| **Navigation** | `@react-navigation/stack` (mobile) | React Router DOM (web) |
| **Database** | MongoDB (Mongoose ODM) | PostgreSQL (pg pool) |
| **Web3** | Wagmi + WalletConnect + viem (mobile deep-link) | Ethers.js v6 + `window.ethereum` (browser) |
| **Carbon MRV** | External Python ML (3mix.py via Ngrok) + image upload | Zero-Image Satellite Engine (NASA POWER API + IPCC) |
| **IPFS** | Pinata (partially integrated) | Pinata (fully wired) |
| **Blockchain** | Ethers.js v5 + broken WalletConnect | Ethers.js v6 + browser MetaMask |
| **UI Styling** | React Native `StyleSheet` | Tailwind CSS + Framer Motion |
| **Maps** | None (GPS capture via expo-location) | React-Leaflet + Esri Satellite Tiles |
| **Charts** | None | Recharts |
| **Deployment** | None (local only) | Vercel (frontend) + Render (API) + Neon (PostgreSQL) |

### 1.3 Critical Problems in the Current Codebase

#### **Problem 1: React Native — Not Web-Compatible**
- [App.js](file:///d:/Programming/PROJECTS/Veriflow_production/veriflow_app/App.js) imports `@walletconnect/react-native-compat`, `react-native-gesture-handler`, `@web3modal/wagmi-react-native`
- [package.json](file:///d:/Programming/PROJECTS/Veriflow_production/veriflow_app/package.json) has 55+ React Native/Expo dependencies (`expo-camera`, `expo-location`, `react-native-reanimated`, etc.)
- All 17 screens in `screen/` use `react-native` primitives (`View`, `Text`, `TouchableOpacity`, `StyleSheet`, `SafeAreaView`, `Alert`)
- Entry point is `"main": "expo-router/entry"` — pure Expo mobile

#### **Problem 2: MongoDB Instead of PostgreSQL**
- [backend/index.js](file:///d:/Programming/PROJECTS/Veriflow_production/backend/index.js) connects to MongoDB via `mongoose.connect(process.env.MONGO_URL)`
- [User.js](file:///d:/Programming/PROJECTS/Veriflow_production/backend/models/User.js) and [Project.js](file:///d:/Programming/PROJECTS/Veriflow_production/backend/models/Project.js) use Mongoose schemas
- No relational integrity — `Project` references `User` via ObjectId but no FK constraints
- Missing critical tables: `plots`, `satellite_reports`, `nft_credits` (PRD requires these)
- The `Project` model stores image schemas, ML results, field verification — all legacy drone-based

#### **Problem 3: Wrong Web3 Stack**
- Uses Ethers.js v5 (`ethers.utils.parseUnits`) instead of v6 (`ethers.parseUnits`)
- WalletConnect/Wagmi for React Native — fails in browser
- Hardcoded API keys exposed in [blockchainService.js](file:///d:/Programming/PROJECTS/Veriflow_production/veriflow_app/services/blockchainService.js#L18-L24) (Pinata JWT, API key, secret)
- Contract ABI doesn't match PRD — missing `purchaseCredit()`, `retireCredit()`, marketplace escrow

#### **Problem 4: No Satellite MRV Engine**
- No `satelliteMrvEngine.js` exists
- No NASA POWER API integration
- No NDVI/AGB/BGB/SOC calculation logic
- Legacy ML integration relies on external Python server via Ngrok

#### **Problem 5: Smart Contract Mismatch**
- [CarbonCreditNFT.sol](file:///d:/Programming/PROJECTS/Veriflow_production/veriflow_app/contracts/CarbonCreditNFT.sol) is missing:
  - `purchaseCredit()` (payable marketplace function)
  - `retireCredit()` (ESG retirement)
  - Contract escrow for holding NFTs
  - MATIC payment forwarding to farmer wallet
  - `CreditPurchased` and `CreditRetired` events
- Uses deprecated `Counters.sol` (removed in OpenZeppelin v5)

#### **Problem 6: Hardcoded Network IPs**
- [api.js](file:///d:/Programming/PROJECTS/Veriflow_production/veriflow_app/config/api.js) hardcodes `SERVER_IP = "10.140.130.110"` with platform detection for mobile
- Shell scripts (`update-server-ip.sh`, `update-ml-api-url.sh`) for IP patching — mobile-era artifacts

### 1.4 Files to KEEP vs. DELETE

| Status | Files | Reason |
|--------|-------|--------|
| **DELETE** | Entire `veriflow_app/` directory | React Native codebase — incompatible with web |
| **DELETE** | `veriflow_app/screen/*.jsx` (17 files) | All use `react-native` primitives |
| **DELETE** | `veriflow_app/App.js` | Expo/WagmiProvider/React Navigation |
| **DELETE** | `veriflow_app/package.json` | 55+ RN/Expo dependencies |
| **DELETE** | `veriflow_app/app.json`, `babel.config.js`, `tsconfig.json` | Expo configuration |
| **DELETE** | `veriflow_app/services/blockchainService.js` | Ethers v5 + WalletConnect + hardcoded keys |
| **DELETE** | `veriflow_app/components/ChatBox.jsx`, `NFTCard.jsx` | React Native UI |
| **DELETE** | `veriflow_app/*.md` (6 guide files) | Legacy setup guides |
| **DELETE** | `veriflow_app/*.sh` (2 shell scripts) | IP address patching for mobile |
| **DELETE** | `backend/models/Project.js` + `Project.js.bak` | MongoDB schema with image/drone/ML fields |
| **DELETE** | `backend/models/User.js` | MongoDB/Mongoose schema |
| **DELETE** | `backend/models/CarbonCredit.js` | Likely empty/broken |
| **DELETE** | `backend/controllers/projectController.js` | Image upload, ML results — wrong paradigm |
| **DELETE** | `backend/routes/projectRoutes.js` | Routes for old project model |
| **DELETE** | `backend/uploads/` | Image storage directory |
| **DELETE** | Root `package.json` + `package-lock.json` | Only holds `@openzeppelin/contracts` |
| **REWORK** | `backend/index.js` | Change MongoDB → PostgreSQL |
| **REWORK** | `backend/controllers/authController.js` | Adapt from Mongoose to `pg` |
| **REWORK** | `backend/routes/authRoutes.js` | Keep structure, update handler |
| **KEEP** | `docs/` folder | PRD and Architecture docs — our source of truth |
| **KEEP (reference)** | `veriflow_app/contracts/CarbonCreditNFT.sol` | Base contract — needs major upgrades |
| **KEEP** | `.git/` | Version history |

---

## Part 2: Architectural Decision — Edit In-Place vs. Fresh Start

### Decision: **EDIT THE EXISTING REPOSITORY IN-PLACE**

**Reasoning:**

1. **Git history preservation** — We keep the 7 existing commits as historical proof of the SIH journey. Recruiters and professors can see the evolution.
2. **Same GitHub remote** — No need to create a new repo, transfer settings, or update links on resume/LinkedIn.
3. **Clean branch strategy** — We'll create a `v2-web-migration` branch, delete all legacy files, and build fresh. When complete, merge to `main`.
4. **The repo is small** — Only ~1.2MB of actual source code. Nuking and rebuilding is trivial.
5. **Monorepo in the same root** — The PRD wants `client/`, `server/`, `contracts/` directories. We'll restructure directly.

> [!IMPORTANT]
> We will **NOT** try to adapt React Native components to React web. Every single screen must be rewritten from scratch in React.js + Tailwind CSS. The effort to convert `StyleSheet` → CSS, `View` → `div`, `TouchableOpacity` → `button`, `Alert` → toast, `AsyncStorage` → localStorage, `react-navigation` → `react-router-dom` **for 17 screens** exceeds a clean rewrite by 3x.

### New Directory Structure (Clean Monorepo)

```
Veriflow_production/
├── .git/                           # Preserved history
├── .gitignore                      # Updated for web stack
├── .env.example                    # Template for environment variables
├── docs/                           # PRD + Architecture docs (KEPT)
│   ├── VeriFlow_Web_Product_Requirements_Document-v2.md
│   └── VeriFlow_Web_System_Flow_and_Execution_Architecture-v2.md
│
├── contracts/                      # Solidity Smart Contract Workspace
│   ├── VeriFlowCarbonNFT.sol       # Upgraded ERC-721 + Marketplace + Retirement
│   ├── hardhat.config.js           # Hardhat for Polygon Amoy
│   ├── scripts/
│   │   └── deploy.js               # Deployment script
│   ├── test/
│   │   └── VeriFlowCarbonNFT.test.js
│   ├── artifacts/                  # Compiled ABI (auto-generated)
│   ├── package.json
│   └── .env                        # PRIVATE_KEY, POLYGONSCAN_API_KEY
│
├── server/                         # Node.js + Express + PostgreSQL Backend
│   ├── package.json
│   ├── index.js                    # Express server entry
│   ├── .env                        # DATABASE_URL, JWT_SECRET, NASA_API_KEY
│   ├── config/
│   │   └── db.js                   # PostgreSQL connection pool (pg)
│   ├── db/
│   │   ├── schema.sql              # CREATE TABLE users, plots, satellite_reports, nft_credits
│   │   └── seed.sql                # Demo users (farmer, admin, buyer)
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── services/
│   │   ├── satelliteMrvEngine.js   # NASA POWER API + NDVI + IPCC Allometry
│   │   └── ipfsPinataService.js    # IPFS metadata pinning via Pinata
│   ├── controllers/
│   │   ├── authController.js       # Login, Register (PostgreSQL)
│   │   ├── plotController.js       # CRUD for plots
│   │   ├── verifyController.js     # Satellite verification engine trigger
│   │   └── marketplaceController.js # Record mint, purchase, retirement
│   └── routes/
│       ├── authRoutes.js
│       ├── plotRoutes.js
│       ├── verifyRoutes.js
│       └── marketplaceRoutes.js
│
├── client/                         # React.js (Vite) + Tailwind CSS Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.jsx                # ReactDOM.createRoot entry
│   │   ├── App.jsx                 # Router + Layout + Role Switcher
│   │   ├── index.css               # Tailwind imports + global styles
│   │   ├── config/
│   │   │   ├── api.js              # API_BASE URL (env-driven)
│   │   │   └── constants.js        # Chain config, species list, etc.
│   │   ├── services/
│   │   │   ├── web3Client.js       # Ethers.js v6 + MetaMask (window.ethereum)
│   │   │   ├── authService.js      # JWT login/register
│   │   │   ├── plotService.js      # Plot CRUD API calls
│   │   │   └── marketplaceService.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx          # Top nav + Role Switcher pill
│   │   │   │   ├── Sidebar.jsx         # Role-based sidebar
│   │   │   │   └── Layout.jsx          # Main layout wrapper
│   │   │   ├── shared/
│   │   │   │   ├── GlassCard.jsx       # Glassmorphic card component
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   └── TransactionModal.jsx # Live blockchain step modal
│   │   │   ├── maps/
│   │   │   │   ├── SatelliteMap.jsx     # React-Leaflet + Esri tiles
│   │   │   │   └── PlotMarker.jsx       # Animated map marker + radius
│   │   │   ├── charts/
│   │   │   │   ├── NdviGauge.jsx        # Recharts NDVI radial bar
│   │   │   │   ├── BiomassChart.jsx     # AGB/BGB/SOC stacked bar
│   │   │   │   └── CarbonProjection.jsx # 5-year projection line chart
│   │   │   └── marketplace/
│   │   │       ├── CreditCard.jsx       # NFT credit display card
│   │   │       ├── ESGCertificate.jsx   # Printable retirement certificate
│   │   │       └── FilterBar.jsx        # Species/NDVI/status filters
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── farmer/
│   │   │   │   ├── FarmerDashboard.jsx
│   │   │   │   └── PlotRegistration.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── MrvStudio.jsx        # Verification queue + charts
│   │   │   │   └── MintingStudio.jsx    # IPFS + NFT minting
│   │   │   └── buyer/
│   │   │       ├── Marketplace.jsx
│   │   │       └── Portfolio.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useWeb3.js
│   │   │   └── useMetaMask.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── Web3Context.jsx
│   │   └── utils/
│   │       ├── formatters.js
│   │       └── validators.js
│   └── .env                        # VITE_API_BASE, VITE_CONTRACT_ADDRESS
│
├── .agents/                        # Context memory files for AI builds
│   └── context/
│       ├── PROJECT_CONTEXT.md      # What this project is
│       ├── TECH_STACK.md           # Technology decisions
│       └── CURRENT_PHASE.md        # Which phase we're in
│
└── README.md                       # Updated project documentation
```

---

## Part 3: Complete Step-by-Step Execution Plan

### Phase 0: Pre-Migration — Git Setup & Legacy Cleanup
**Goal:** Create a clean branch, archive legacy code, remove all React Native/MongoDB artifacts.

| Step | Action | Reasoning |
|------|--------|-----------|
| 0.1 | Create branch `v2-web-migration` from `main` | Safe isolation — `main` stays intact |
| 0.2 | Delete `veriflow_app/` entirely | All 17 screens, App.js, configs, services — pure React Native |
| 0.3 | Delete `backend/models/`, `backend/controllers/`, `backend/routes/`, `backend/uploads/` | MongoDB schemas, image upload logic, old project CRUD |
| 0.4 | Delete root `package.json`, `package-lock.json` | Only holds `@openzeppelin/contracts` (will be in `contracts/`) |
| 0.5 | Delete `QUICK_START.md`, `README.md` (root) | Outdated guides |
| 0.6 | Keep `docs/` and `.git/` | Source of truth & history |
| 0.7 | Update `.gitignore` for web stack | Add `dist/`, `*.local`, `.env`, `artifacts/` |
| 0.8 | Commit: `chore: archive legacy React Native/MongoDB codebase` | Clean slate |

### Phase 1: PostgreSQL Database Setup
**Goal:** Set up cloud-hosted PostgreSQL with proper relational schema.

| Step | Action | Reasoning |
|------|--------|-----------|
| 1.1 | Create free PostgreSQL instance on **Neon.tech** | Serverless PostgreSQL, free tier, instant provisioning |
| 1.2 | Write `server/db/schema.sql` with 4 tables | `users`, `plots`, `satellite_reports`, `nft_credits` per PRD |
| 1.3 | Add proper constraints | FK refs, UNIQUE on `nft_credits.plot_id`, NUMERIC precision |
| 1.4 | Write `server/db/seed.sql` | Demo users for all 3 roles with test wallet addresses |
| 1.5 | Execute schema + seed on Neon | Verify tables in Neon SQL Editor |
| 1.6 | Commit: `feat: add PostgreSQL schema and seed data` | |

**Verification Milestone:** All 4 tables visible in Neon SQL Editor; seed rows queryable.

### Phase 2: Express.js Backend (Node.js + PostgreSQL)
**Goal:** Build the complete REST API with satellite MRV engine.

| Step | Action | Reasoning |
|------|--------|-----------|
| 2.1 | Initialize `server/package.json` with deps | `express`, `pg`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `axios` |
| 2.2 | Build `server/config/db.js` | PostgreSQL connection pool using `pg.Pool` with `DATABASE_URL` |
| 2.3 | Build `server/middleware/auth.js` | JWT verification middleware |
| 2.4 | Build Auth controllers + routes | `POST /api/auth/register`, `POST /api/auth/login` |
| 2.5 | Build Plot controllers + routes | `GET /api/plots`, `POST /api/plots`, `GET /api/plots/:id` |
| 2.6 | **Build `satelliteMrvEngine.js`** | NASA POWER API fetch + NDVI + AGB/BGB/SOC + tCO2e calculation |
| 2.7 | Build Verify controller + route | `POST /api/plots/:id/verify-satellite` |
| 2.8 | Build `ipfsPinataService.js` | JSON metadata pinning to Pinata IPFS |
| 2.9 | Build Marketplace controller + routes | `POST /api/plots/:id/record-mint`, `POST /api/plots/:id/record-purchase` |
| 2.10 | Build `server/index.js` entry point | Express setup, CORS, route mounting, pg pool |
| 2.11 | Test all endpoints with curl/Postman | Verify NDVI calculation < 2s |
| 2.12 | Commit: `feat: complete Express API with satellite MRV engine` | |

**Verification Milestone:** `POST /api/plots/:id/verify-satellite` returns NDVI & tCO2e in < 2 seconds.

### Phase 3: Solidity Smart Contract Upgrade & Deployment
**Goal:** Upgrade the contract to include marketplace escrow, purchase, and retirement.

| Step | Action | Reasoning |
|------|--------|-----------|
| 3.1 | Initialize `contracts/` with Hardhat | `npx hardhat init`, configure for Polygon Amoy |
| 3.2 | Rewrite `VeriFlowCarbonNFT.sol` | Add `purchaseCredit()` (payable), `retireCredit()`, escrow holding |
| 3.3 | Remove deprecated `Counters.sol` | Use manual counter (OZ v5 removed Counters) |
| 3.4 | Add events: `CreditMinted`, `CreditPurchased`, `CreditRetired` | On-chain event logging |
| 3.5 | Write unit tests | Test mint → purchase → retire flow |
| 3.6 | Deploy to Polygon Amoy Testnet | Get contract address + ABI |
| 3.7 | Verify on `amoy.polygonscan.com` | Source code verification |
| 3.8 | Export ABI to `client/src/config/` | Frontend needs ABI for Ethers.js |
| 3.9 | Commit: `feat: deploy VeriFlowCarbonNFT v2 with marketplace escrow` | |

**Verification Milestone:** Contract verified on amoy.polygonscan.com.

### Phase 4: React.js (Vite) Frontend — Foundation
**Goal:** Scaffold the web app with design system, routing, auth.

| Step | Action | Reasoning |
|------|--------|-----------|
| 4.1 | Scaffold Vite React app in `client/` | `npm create vite@latest ./ -- --template react` |
| 4.2 | Install Tailwind CSS v3 + PostCSS | Dark theme, glassmorphism utilities |
| 4.3 | Install key deps | `react-router-dom`, `react-leaflet`, `recharts`, `ethers`, `lucide-react`, `framer-motion`, `axios` |
| 4.4 | Build design system in `index.css` | Custom Tailwind config: Obsidian & Bioluminescent Emerald theme |
| 4.5 | Build `Layout.jsx` + `Navbar.jsx` | Role switcher pill, MetaMask connect button |
| 4.6 | Build `GlassCard.jsx` + shared components | Reusable glassmorphic card, badges, spinners |
| 4.7 | Set up React Router with protected routes | Role-based route guards |
| 4.8 | Build `AuthContext.jsx` + `useAuth.js` | JWT + localStorage session management |
| 4.9 | Build `LoginPage.jsx` + `LandingPage.jsx` | Auth flow with demo role switcher |
| 4.10 | Commit: `feat: scaffold React Vite app with auth and design system` | |

**Verification Milestone:** Login works with JWT, role switcher changes UI context.

### Phase 5: Interactive Satellite Map & Farmer Portal
**Goal:** Build the zero-image geospatial plot registration system.

| Step | Action | Reasoning |
|------|--------|-----------|
| 5.1 | Build `SatelliteMap.jsx` with React-Leaflet | Esri World Satellite Imagery tiles |
| 5.2 | Implement click-to-capture GPS | Map click → lat/lng auto-fill |
| 5.3 | Implement browser geolocation fallback | `navigator.geolocation.getCurrentPosition()` |
| 5.4 | Build `PlotMarker.jsx` | Animated marker + radius circle proportional to `area_hectares` |
| 5.5 | Build `PlotRegistration.jsx` page | Form: title, species dropdown, area, wallet address, map picker |
| 5.6 | Build `FarmerDashboard.jsx` | My plots list with status badges (SUBMITTED/VERIFIED/MINTED) |
| 5.7 | Wire to backend: `POST /api/plots` | Submit plot registration |
| 5.8 | Commit: `feat: interactive satellite map and farmer portal` | |

**Verification Milestone:** Clicking map auto-fills GPS; plot submits to PostgreSQL with status SUBMITTED.

### Phase 6: Admin MRV Verification Studio & Charts
**Goal:** Build the satellite telemetry verification UI with interactive charts.

| Step | Action | Reasoning |
|------|--------|-----------|
| 6.1 | Build `MrvStudio.jsx` | Verification queue showing SUBMITTED plots |
| 6.2 | Wire "Run Satellite Analysis" button | Calls `POST /api/plots/:id/verify-satellite` |
| 6.3 | Build `NdviGauge.jsx` | Recharts RadialBarChart for NDVI and canopy cover |
| 6.4 | Build `BiomassChart.jsx` | Stacked bar: AGB vs. BGB vs. SOC |
| 6.5 | Build `CarbonProjection.jsx` | 5-year sequestration projection line chart |
| 6.6 | Build `AdminDashboard.jsx` | Stats overview, recent verifications, queue |
| 6.7 | Commit: `feat: admin MRV studio with satellite telemetry charts` | |

**Verification Milestone:** NDVI, biomass split, tCO2e render as interactive Recharts gauges.

### Phase 7: Blockchain Wiring — Ethers.js v6 + MetaMask
**Goal:** Connect the frontend to MetaMask and Polygon Amoy smart contract.

| Step | Action | Reasoning |
|------|--------|-----------|
| 7.1 | Build `web3Client.js` | Ethers.js v6 + `window.ethereum` provider |
| 7.2 | Build `Web3Context.jsx` + `useMetaMask.js` | Wallet connect, network switching, account tracking |
| 7.3 | Implement auto network switch | `wallet_switchEthereumChain` → Polygon Amoy (0x13882) |
| 7.4 | Build `MintingStudio.jsx` | IPFS pin → MetaMask sign → `mintCarbonCredit()` → save to DB |
| 7.5 | Build `TransactionModal.jsx` | Live 4-step progress: IPFS → MetaMask → Polygon → PostgreSQL |
| 7.6 | Implement Demo Mode fallback | Simulated signer for evaluators without MetaMask |
| 7.7 | Commit: `feat: Ethers.js v6 blockchain wiring with MetaMask` | |

**Verification Milestone:** End-to-end mint: IPFS pin → MetaMask popup → tx confirmed → DB updated.

### Phase 8: Carbon Credit Marketplace & ESG Retirement
**Goal:** Build buyer-facing marketplace, purchase flow, and ESG certificates.

| Step | Action | Reasoning |
|------|--------|-----------|
| 8.1 | Build `Marketplace.jsx` | Grid of MINTED credits with satellite badges |
| 8.2 | Build `CreditCard.jsx` | NFT card: species, NDVI, tCO2e, price, PolygonScan link |
| 8.3 | Build `FilterBar.jsx` | Filter by species, NDVI score, status |
| 8.4 | Wire "Purchase" button | `purchaseCredit(tokenId, { value: priceWei })` |
| 8.5 | Wire "Retire for ESG" button | `retireCredit(tokenId)` |
| 8.6 | Build `ESGCertificate.jsx` | Printable gold-bordered certificate with tx hash, tCO2e |
| 8.7 | Build `Portfolio.jsx` | Buyer's purchased and retired credits |
| 8.8 | Commit: `feat: marketplace, purchase flow, and ESG certificate` | |

**Verification Milestone:** Full lifecycle: Register → Verify → Mint → Purchase → Retire → Certificate.

### Phase 9: Cloud Deployment
**Goal:** Deploy to production-grade cloud infrastructure.

| Step | Action | Reasoning |
|------|--------|-----------|
| 9.1 | Deploy Express API to **Render.com** | Free tier, auto-deploy from GitHub, environment variables |
| 9.2 | Connect Render to Neon PostgreSQL | `DATABASE_URL` in Render env vars |
| 9.3 | Deploy React Vite frontend to **Vercel** | Free tier, instant builds, custom domain ready |
| 9.4 | Set `VITE_API_BASE` env var on Vercel | Point frontend to Render API URL |
| 9.5 | Test full flow on live URLs | End-to-end from `.vercel.app` |
| 9.6 | Add 1-click Demo Role Switcher for recruiters | No login required for demo |
| 9.7 | Commit: `feat: cloud deployment on Vercel + Render + Neon` | |

**Verification Milestone:** Live `.vercel.app` URL working end-to-end.

### Phase 10: Polish, Security & Merge
**Goal:** Final security audit, performance optimization, and merge to main.

| Step | Action | Reasoning |
|------|--------|-----------|
| 10.1 | Security audit: remove all hardcoded secrets | Environment variables only |
| 10.2 | Add CORS restrictions (production origin only) | No more `origin: "*"` |
| 10.3 | Add rate limiting to API | `express-rate-limit` |
| 10.4 | Input validation on all endpoints | SQL injection prevention via parameterized queries |
| 10.5 | Add proper error boundaries in React | Graceful error handling |
| 10.6 | Performance: lazy load pages | React.lazy + Suspense |
| 10.7 | Update `README.md` | Live demo URL, tech stack, setup instructions |
| 10.8 | Merge `v2-web-migration` → `main` | Production release |
| 10.9 | Tag release: `v2.0.0` | |

---

## Part 4: UI/UX Design Strategy

### Design System: "Obsidian & Bioluminescent Emerald"

| Element | Specification |
|---------|--------------|
| **Primary Background** | Deep obsidian slate: `#020617` → `#0f172a` gradient |
| **Card Surface** | Frosted glass: `bg-slate-900/70 backdrop-blur-md` |
| **Card Border** | Emerald glow: `border border-emerald-500/30` |
| **Primary Accent** | Bioluminescent emerald: `#10b981` → `#34d399` |
| **Secondary Accent** | Teal: `#14b8a6` |
| **Alert/Warning** | Amber: `#f59e0b` |
| **Success** | Green: `#22c55e` |
| **Error** | Rose: `#f43f5e` |
| **Typography** | Inter (headings) + JetBrains Mono (data/numbers) |
| **Border Radius** | `rounded-2xl` for cards, `rounded-full` for pills |
| **Shadows** | `shadow-emerald-500/10` glows |

### Key Visual Components

1. **Glassmorphic Cards** — Every data card uses frosted glass with subtle emerald border glow
2. **Interactive Satellite Map** — Esri World Imagery tiles, animated pin drops, radius circles
3. **Recharts Telemetry Studio** — Radial NDVI gauge, stacked biomass bars, 5-year projection
4. **Blockchain Transaction Stepper** — 4-step modal with live status transitions + PolygonScan link
5. **ESG Certificate Generator** — Gold-bordered, printable PDF-style certificate
6. **Role Switcher Pill** — Top nav animated toggle: `Farmer | Admin | Buyer`
7. **Framer Motion Animations** — Page transitions, card hover lifts, loading skeletons

---

## Part 5: Version Control Strategy

### Branch Strategy

```
main                          ← Production (current: legacy React Native)
  └── v2-web-migration        ← Full rebuild branch
       ├── phase/0-cleanup         ← Legacy deletion
       ├── phase/1-database        ← PostgreSQL schema
       ├── phase/2-backend         ← Express API
       ├── phase/3-contracts       ← Smart contract
       ├── phase/4-frontend-base   ← Vite + auth + design system
       ├── phase/5-farmer-portal   ← Maps + plot registration
       ├── phase/6-admin-studio    ← MRV verification + charts
       ├── phase/7-blockchain      ← Ethers.js + MetaMask
       ├── phase/8-marketplace     ← Buyer flows + ESG
       ├── phase/9-deployment      ← Cloud deploy
       └── phase/10-polish         ← Security + merge
```

### Commit Convention

```
feat: add new feature
fix: bug fix
chore: cleanup, refactoring
docs: documentation
test: testing
deploy: deployment changes
security: security fixes
```

### Commit Checkpoints

Each phase ends with a commit. After every phase, we:
1. Run the app locally to verify the milestone
2. Check for console errors
3. Test the specific functionality built in that phase
4. Commit with descriptive message

---

## Part 6: Configuration Requirements

### Environment Variables You Need to Set Up

#### `server/.env`
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your-secret-key-here
PORT=5000
NASA_POWER_API_URL=https://power.larc.nasa.gov/api/temporal/daily/point
PINATA_API_KEY=your-pinata-api-key
PINATA_API_SECRET=your-pinata-api-secret
PINATA_JWT=your-pinata-jwt
NODE_ENV=development
```

#### `client/.env`
```env
VITE_API_BASE=http://localhost:5000
VITE_CONTRACT_ADDRESS=0x... (after deployment)
VITE_POLYGON_RPC=https://rpc-amoy.polygon.technology/
VITE_CHAIN_ID=80002
```

#### `contracts/.env`
```env
PRIVATE_KEY=your-deployer-wallet-private-key
POLYGONSCAN_API_KEY=your-polygonscan-api-key
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
```

### External Services to Configure

| Service | Purpose | Setup |
|---------|---------|-------|
| **Neon.tech** | PostgreSQL database | Free account, create project, get connection string |
| **Pinata** | IPFS metadata pinning | You already have API keys (rotate them — they were exposed in code) |
| **MetaMask** | Browser wallet | Install extension, add Polygon Amoy testnet |
| **Polygon Amoy Faucet** | Test MATIC tokens | Get testnet MATIC from faucet.polygon.technology |
| **Render.com** | Backend API hosting | Connect GitHub repo, set environment variables |
| **Vercel** | Frontend hosting | Connect GitHub repo, set build command |

> [!CAUTION]
> **SECURITY CRITICAL:** Your Pinata API keys, JWT token, and WalletConnect project ID were hardcoded in [blockchainService.js](file:///d:/Programming/PROJECTS/Veriflow_production/veriflow_app/services/blockchainService.js#L18-L24) and committed to Git. **Rotate these keys immediately.** In the new build, all secrets go in `.env` files excluded by `.gitignore`.

---

## Part 7: Debugging & Security Checklist (Per Phase)

### Phase-Level Security Checks

| Phase | Security Check |
|-------|---------------|
| **Phase 0** | Verify no secrets in git history (consider `git filter-branch` if needed) |
| **Phase 1** | Parameterized SQL queries only — no string concatenation |
| **Phase 2** | bcrypt password hashing, JWT expiry, rate limiting |
| **Phase 3** | Solidity: reentrancy guards, access control, integer overflow protection |
| **Phase 4** | XSS prevention, CORS origin restriction, input sanitization |
| **Phase 5** | Validate GPS coordinates server-side (valid lat/lng ranges) |
| **Phase 6** | Validate NASA API responses, handle timeouts gracefully |
| **Phase 7** | Never store private keys client-side, validate wallet addresses |
| **Phase 8** | Verify msg.value matches price in contract, prevent front-running |
| **Phase 9** | HTTPS only, environment variables on hosting platforms |
| **Phase 10** | Full audit: OWASP top 10, dependency vulnerability scan |

---

## Summary: Execution Timeline

| Phase | Description | Est. Effort |
|-------|-------------|-------------|
| **Phase 0** | Git setup + legacy cleanup | 30 min |
| **Phase 1** | PostgreSQL database setup | 1 hour |
| **Phase 2** | Express API + Satellite Engine | 4–5 hours |
| **Phase 3** | Smart contract upgrade + deploy | 2–3 hours |
| **Phase 4** | React Vite frontend foundation | 3–4 hours |
| **Phase 5** | Satellite map + farmer portal | 3–4 hours |
| **Phase 6** | Admin MRV studio + charts | 3–4 hours |
| **Phase 7** | Ethers.js v6 blockchain wiring | 3–4 hours |
| **Phase 8** | Marketplace + ESG certificates | 3–4 hours |
| **Phase 9** | Cloud deployment | 1–2 hours |
| **Phase 10** | Polish + security + merge | 2–3 hours |
| **TOTAL** | | **~26–34 hours** |

---

> [!TIP]
> **Recommended approach:** We execute phase-by-phase, committing after each. I'll build each phase incrementally, test it, and move forward. You configure external services (Neon, MetaMask, Pinata) as we reach each phase.
