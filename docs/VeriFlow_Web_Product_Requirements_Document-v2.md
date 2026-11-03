## VeriFlow Web 2.0 — Product Requirements Document

Full-Stack Blue Carbon MRV Registry, Satellite Remote Sensing Engine & Polygon ERC-721 Carbon Marketplace

System Classification: Web3 Climate-FinTech & Geospatial Registry

Document Version: PRD v2.0 (Web + PostgreSQL Release)

Primary Stack: React.js (Vite), PostgreSQL, Express.js, Ethers.js v6, Solidity

Target Hosting: Vercel (Frontend) + Render (API) + Neon (PostgreSQL)

## 1. Product Vision, Problem Statement & Target Goals

## 1.1 Problem Statement

Coastal mangrove ecosystems ("Blue Carbon") sequester carbon up to 10 times faster per hectare than tropical rainforests, yet small-scale coastal farmers and NGOs are locked out of global carbon credit markets. Traditional Measurement, Reporting, and Verification (MRV) requires expensive physical site audits and takes 12 to 24 months, while opaque centralized registries suffer from double-counting and middleman fees exceeding 40%.

## 1.2 Product Vision (VeriFlow Web 2.0)

VeriFlow Web 2.0 is a decentralized, browser-accessible Blue Carbon MRV Registry and Web3 Marketplace. It enables coastal project developers to register mangrove plots purely via GPS coordinates on an interactive satellite map, automates biomass and carbon accounting using Earth-Observation Satellite Remote Sensing (NDVI + IPCC Tier-2 Allometric Equations), tokenizes verified carbon credits as immutable ERC-721 NFTs on the Polygon blockchain, and allows corporate buyers to purchase and retire credits with instant MATIC settlement directly to the farmer's wallet.

## 1.3 Target Success Metrics (KPIs)

- Zero-Image Verification Speed: Satellite NDVI and biomass calculation completes in under 2.5 seconds per plot without requiring drone hardware or manual photo uploads.

- Web3 Reliability: 100% transaction signing compatibility on desktop browsers using native MetaMask (window.ethereum) and Ethers.js v6 on Polygon Amoy Testnet.

- Data Integrity: Strict relational enforcement in PostgreSQL ensuring 1:1 mapping between registered plots, satellite verification reports, and minted blockchain token IDs.

- Portfolio Readiness: Instant 1-click Demo Role Switcher allowing technical interviewers to test Farmer, Admin, and Buyer workflows on a live URL in under 90 seconds.

## 2. User Personas & Role-Based Access Control (RBAC) Matrix

| Persona / |   |   |
| --- | --- | --- |
| Primary Responsibilities | Database Permissions | Smart Contract Permissions |
| Role |   |   |
| Coastal Registers mangrove plantation coordinates | INSERT on plots; | Receives ERC-721 credit proceeds |
| Farmer / via interactive satellite map, tracks MRV | SELECT own plots, | automatically via payable escrow |
| NGO verification status, and receives MATIC | satellite reports, and NFT | settlement. |
| (role = payouts upon NFT sale. | sale status. |   |
| 'farmer') |   |   |


|   | Persona / Primary Responsibilities Database Permissions Smart Contract Permissions Role MRV Audits submitted plots, triggers automated SELECT all plots; Executes mintCarbonCredit() on Registry Satellite Remote Sensing engine, pins MRV INSERT/UPDATE on Polygon Amoy contract. Auditor JSON proof to IPFS, and signs NFT minting satellite_reports and (role = transactions. nft_credits. 'admin') Corporate Browses verified Blue Carbon NFTs, SELECT minted Executes purchaseCredit() (payable) ESG Buyer inspects satellite NDVI & IPFS proofs, marketplace listings; and retireCredit(). |
| --- | --- |
|   | (role = purchases credits with MATIC, and retires UPDATE ownership & |
|   | 'buyer') credits for ESG compliance. retirement state. |

## 3. Detailed Functional Requirements & Module Specifications

MOD-01

- FR-1.1 (JWT & Session Persistence): System shall support email/password login backed by PostgreSQL users table and store session state in browser localStorage.

- FR-1.2 (Recruiter Instant Role Switcher): Top navigation bar shall include a 1-click Role Switcher pill (Farmer Portal | Admin MRV Studio | Buyer Marketplace) so evaluators can test the entire 3-role lifecycle without logging in and out repeatedly.

- FR-1.3 (MetaMask Auto-Network Switching): Clicking "Connect MetaMask" shall request accounts via eth_requestAccounts and automatically invoke wallet_switchEthereumChain (or wallet_addEthereumChain) for Polygon Amoy Testnet (chainId: 0x13882).

Interactive Satellite Map & Zero-Image Plot Registration

- FR-2.1 (Interactive Satellite Map Picker): Farmer Portal shall embed a React-Leaflet map using Esri World Satellite Imagery tiles centered on major coastal mangrove zones (e.g., Sundarbans, Bhitarkanika, Pichavaram, Gujarat Gulf of Kutch).

- FR-2.2 (Click-to-Capture & Browser Geolocation): Clicking any point on the satellite map or clicking "Use Browser GPS" shall automatically populate the latitude and longitude fields to 6 decimal places and render a visual boundary circle scaled to area_hectares.

- FR-2.3 (Species & Plot Validation): Farmer shall input Project Title, Region Name, Area in Hectares (> 0.1 ha), Farmer Wallet Address, and select a Mangrove Species from the scientifically calibrated list (Rhizophora mucronata, Avicennia marina, Bruguiera gymnorhiza, Sonneratia alba).

- FR-2.4 (Zero Image Requirement): Plot registration shall not require any photo or drone file upload; submission writes directly to PostgreSQL plots with status submitted.

Automated Satellite Remote Sensing & Telemetry Analytics Studio

- FR-3.1 (NASA POWER & Spectral Index Query): When Admin clicks "Run Satellite NDVI Verification", the backend queries agro-climatic satellite telemetry (ALLSKY_SFC_SW_DWN solar irradiance and RH2M coastal

Authentication, Demo Role Switcher & Web3 Network Guard

Priority: P0 (Core)

## MOD-02

Priority: P0 (Core)

## MOD-03

Priority: P0 (Core)


humidity) for the plot's exact (lat, lng), with an automatic deterministic geospatial fallback if the external API is unreachable.

- FR-3.2 (Biomass & Sequestration Engine): Backend computes NDVI, Canopy Cover %, Above-Ground Biomass (AGB), Below-Ground Biomass (BGB), Soil Organic Carbon (SOC), total tCO2e, and total Carbon in kilograms, saving the record in satellite_reports and updating plot status to verified.

- FR-3.3 (Interactive Recharts Telemetry View): Admin UI displays the generated satellite report using interactive charts: an NDVI Health Progress Bar, a Biomass Distribution Chart (AGB vs. BGB vs. SOC), and a badge displaying the satellite data source.

MOD-04

## IPFS Metadata Pinning & Polygon ERC-721 Minting Studio

- FR-4.1 (IPFS Proof Generation): Before minting, the system packages the verified satellite report and plot coordinates into an ERC-721 standard JSON metadata object and generates an IPFS URI (ipfs://...).

- FR-4.2 (On-Chain Mint Execution): Admin sets the listing price in MATIC (e.g., 0.25 MATIC) and clicks "Approve & Mint NFT", triggering mintCarbonCredit() on the Polygon Amoy smart contract via Ethers.js v6.

- FR-4.3 (Database Synchronization): Upon transaction confirmation, the backend stores the on-chain token_id, contract_address, mint_tx_hash, and ipfs_metadata_uri in PostgreSQL nft_credits and updates plot status to minted.

Priority: P0 (Core)

- FR-5.1 (Marketplace Filtering & Inspection): Buyers can filter available carbon credit NFTs by mangrove species, minimum NDVI score, or status (Available vs. Sold/Retired), and inspect the full satellite telemetry card for each lot.

- FR-5.2 (Atomic Purchase & Farmer Payout): Clicking "Purchase Carbon Credit" invokes purchaseCredit(tokenId) sending MATIC equal to priceWei. The smart contract transfers the ERC-721 NFT to the buyer and immediately transfers the MATIC payment to the Farmer's wallet address.

- FR-5.3 (ESG Credit Retirement & Certificate): Owners of purchased credits can click "Retire Credit for ESG Offset" to permanently mark the credit as retired on-chain (is_retired = true) and open a printable ESG Carbon Offset Certificate modal.

Priority: P0 (Core)

## MOD-05 Carbon Credit Marketplace, MATIC Escrow Settlement & ESG Retirement

## 4. PostgreSQL Relational Database Specification (Data Dictionary)

| Primary Foreign Keys & Table Name Key Columns & Data Types Key Relations users id Referenced by full_name VARCHAR(120), email VARCHAR(150) UNIQUE, role VARCHAR(30), (SERIAL) plots.farmer_id wallet_address VARCHAR(42) plots id farmer_id → title VARCHAR(180), species VARCHAR(100), area_hectares NUMERIC(10,2), (SERIAL) users(id) latitude NUMERIC(9,6), longitude NUMERIC(9,6), region_name VARCHAR(150), status VARCHAR(30) satellite_reports id plot_id UNIQUE → ndvi_score NUMERIC(5,4), canopy_cover_pct NUMERIC(5,2), solar_irradiance (SERIAL) plots(id) NUMERIC(6,2), coastal_humidity NUMERIC(5,2), agb_mg_per_ha |
| --- |


| Primary | Foreign Keys & |
| --- | --- |
| Table Name | Key Columns & Data Types |
| Key | Relations |
|   | NUMERIC(10,2), bgb_mg_per_ha NUMERIC(10,2), soc_mg_per_ha |
|   | NUMERIC(10,2), co2_tons_total NUMERIC(12,2), carbon_kg_total BIGINT |
| nft_credits id | plot_id UNIQUE → token_id INTEGER, contract_address VARCHAR(42), farmer_wallet |
| (SERIAL) | plots(id) VARCHAR(42), owner_wallet VARCHAR(42), price_matic NUMERIC(12,4), |
|   | ipfs_metadata_uri TEXT, mint_tx_hash VARCHAR(66), purchase_tx_hash |
|   | VARCHAR(66), is_for_sale BOOLEAN, is_retired BOOLEAN |

## 5. REST API & Solidity Smart Contract Interface Specification

|   | Endpoint / Function Layer Input Parameters Expected Output / State Change GET /api/plots Express Optional query filter (status, species) Returns all plots joined with users, REST API satellite_reports, and nft_credits. POST /api/plots Express { farmer_id, title, species, area_hectares, Inserts new plot in PostgreSQL with status REST API latitude, longitude, region_name } submitted; returns created plot row. POST /api/plots/:id/verify- Express plotId (URL parameter) Computes NDVI, AGB, BGB, SOC, and satellite Satellite tCO2e; writes to satellite_reports; sets status Engine to verified. POST /api/plots/:id/record- Express { token_id, contract_address, Inserts minted NFT metadata into nft_credits; mint REST API farmer_wallet, price_matic, sets plot status to minted. ipfs_metadata_uri, mint_tx_hash } POST /api/plots/:id/record- Express { buyer_wallet, purchase_tx_hash, Updates owner_wallet, sets is_for_sale = purchase REST API retire_immediately } false, and updates plot status to sold or retired. mintCarbonCredit(...) Solidity (address farmer, uint256 carbonKg, Mints ERC-721 token into contract escrow, Contract uint256 priceWei, string coords, string stores CarbonCredit struct, emits uri) CreditMinted. purchaseCredit(uint256 Solidity tokenId + msg.value ≥ priceWei Transfers NFT to buyer, pays MATIC to tokenId) Contract farmer wallet, emits CreditPurchased. (payable) |
| --- | --- |
|   | retireCredit(uint256 Solidity tokenId (must be called by owner) Sets isRetired = true permanently on-chain, tokenId) Contract emits CreditRetired. |

## 6. Non-Functional Requirements (NFRs), Edge Cases & Risk Mitigation

- NFR-1 (Hybrid Demo Mode for Non-Web3 Evaluators): If a recruiter or professor opens the deployed Vercel link on a browser without MetaMask installed, the frontend shall offer a "Simulated On-Chain Signer (Demo Mode)" fallback alongside real MetaMask signing so they can still experience the full minting, marketplace purchase, and ESG certificate generation flow without getting blocked.

- NFR-2 (Satellite API Resilience): If the NASA POWER API takes longer than 5 seconds or experiences downtime, satelliteMrvEngine.js automatically switches to its deterministic trigonometric geospatial model seeded by (latitude, longitude), guaranteeing 100% uptime during live demos.


- NFR-3 (Double-Minting Prevention): The PostgreSQL nft_credits.plot_id column enforces a strict UNIQUE constraint, preventing the same mangrove plot from being minted twice.
