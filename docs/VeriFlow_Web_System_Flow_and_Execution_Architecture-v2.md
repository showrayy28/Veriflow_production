**DOCUMENT 1 OF 2 • ARCHITECTURE & EXECUTION BLUEPRINT** 

# **VeriFlow Web 2.0: System Flow & Step-by-Step Execution Strategy** 

Architectural Migration from Legacy React Native/MongoDB/Drone-ML to a Production React.js, PostgreSQL, Satellite Remote Sensing & Polygon Web3 Platform 

**Target Deliverable:** Cloud-Deployed Major Project & **Project Origin:** Smart India Hackathon (SIH 2025) Grand Finale Portfolio Flagship **Core Stack:** React.js (Vite) + PostgreSQL + Node/Express + **MRV Methodology:** Zero-Image GPS Satellite NDVI + Solidity (Polygon Amoy) IPCC Tier-2 Allometry 

## **1. Architectural Post-Mortem & Why We Are Re-Engineering VeriFlow** 

During the Smart India Hackathon (SIH 2025) Grand Finale, **VeriFlow** was built under intense time constraints as a multi-repository mobile application using **React Native (Expo)** , **MongoDB** , and an external **Python/Drone Machine Learning pipeline** exposed over temporary Ngrok tunnels. While that prototype demonstrated the concept to hackathon judges, turning VeriFlow into a **flagship Major Project and live resume centerpiece** requires fixing four foundational architectural bottlenecks: 

1. **Eliminating React Native Web3 & Crypto Polyfill Failures:** Mobile JavaScript runtimes (Hermes and Metro Bundler) lack native Node.js cryptography primitives ( **_crypto_** , **_buffer_** , **_stream_** ) and conflict with modern Web3 state libraries such as **_valtio_** and **_@web3modal/wagmi-react-native_** . Furthermore, mobile deep-linking to the MetaMask mobile app frequently drops signing requests on Android emulators. Migrating to a **React.js Web Application** gives us direct, native access to the browser's injected **_window.ethereum_** provider via **Ethers.js v6** —resulting in 100% deterministic wallet connections and transaction signing. 

2. **Replacing Offline Drone & Black-Box ML Models with Automated Satellite Remote Sensing:** In the legacy flow, verifying a single plot required uploading drone imagery and running a heavy Python script ( **_3mix.py_** ) on a teammate's local machine via Ngrok. When that local server went offline, the entire verification, NFT minting, and marketplace pipeline broke. By switching to a **Zero-Image, Coordinate-Driven Satellite Remote Sensing Engine** , the backend uses only the plot's GPS coordinates ( **_latitude_** , **_longitude_** ), plot area, and mangrove species to fetch earth-observation telemetry and calculate carbon sequestration deterministically in under 2 seconds. 

3. **Upgrading from MongoDB to Relational PostgreSQL:** Carbon credit registries are financial-grade ledgers. Storing users, plots, verification metrics, and NFT ownership inside loosely typed MongoDB documents led to inconsistent field names and potential orphan states. Migrating to **PostgreSQL** introduces strict ACID transactions, foreign-key referential integrity ( **_users → plots → satellite_reports → nft_credits_** ), and exact **_NUMERIC_** precision for GPS coordinates, carbon tonnage, and MATIC token pricing. 

4. **Eliminating Local IP Address Switching:** Mobile development forced constant manual IP reconfigurations whenever switching Wi-Fi networks. A browser-based React Vite frontend communicating with a local or cloud Express API ( **_http://localhost:5000_** in development; Render + Vercel in production) permanently eliminates local IP mismatches. 

VeriFlow Web 2.0 — System Flow & Architectural Execution Blueprint 

Page 1 of 6 

|**System**<br>**Dimension**|**Legacy SIH Prototype (v1.0)**|**VeriFlow Web 2.0 (New**<br>**Architecture)**|**Engineering Impact**|
|---|---|---|---|
|**Client Runtime**|React Native (Expo Go) + Metro<br>Bundler|React.js 18 (Vite) + Tailwind CSS +<br>Framer Motion|**Zero Polyfill Crashes**|
|**Database**<br>**Layer**|MongoDB Atlas (NoSQL<br>Document Store)|PostgreSQL (Neon / Supabase Cloud<br>Relational DB)|**ACID & Relational Integrity**|
|**Carbon MRV**<br>**Input**|Manual Drone Image Upload +<br>Local Ngrok ML|GPS Coordinates (Lat/Lng) + Satellite<br>NDVI Engine|**No Image / ML Dependency**|
|**Web3**|Wagmi RN + WalletConnect|Ethers.js v6 + Browser MetaMask|**Instant On-Chain Signing**|
|**Integration**|Deep-Linking|(**_window.ethereum_**)||
|**UI/UX**|Basic Mobile Cards & Static|Interactive Satellite Map + Recharts|**Recruiter-Grade Visual Polish**|
|**Experience**|Alerts|Telemetry Studio||



## **2. Repository Strategy: Why We Must Start a Clean Monorepo** 

#### **Architectural Decision: Do NOT Overwrite the Existing React Native Repository** 

Attempting to convert **_SIH_VERIFLOW-final-main_** in-place will leave behind hundreds of megabytes of **_expo_** , **_reactnative_** , **_metro.config.js_** , and Android/iOS build artifacts that break Vercel web builds. Instead, keep the old repository untouched as historical archive proof of your SIH 2025 journey, and initialize a brand-new, clean repository named **veriflow-web-v2** . 

**Clean Monorepo Directory Structure (** **_veriflow-web-v2/_ )** 

- **_contracts/_ (Web3 Smart Contract Workspace):** Contains **_VeriFlowCarbonNFT.sol_** (ERC-721 URI Storage + Marketplace Escrow + Credit Retirement), Hardhat configuration, deployment scripts for Polygon Amoy Testnet, and exported ABI JSON files. 

- **_server/_ (Node.js + Express + PostgreSQL Backend):** Contains **_db/schema.sql_** , **_config/db.js_** (PostgreSQL connection pool), **_services/satelliteMrvEngine.js_** (NASA POWER + Sentinel-2 NDVI + IPCC Allometric calculator), **_services/ipfsPinataService.js_** , and REST controllers for Auth, Plots, Verification, and Marketplace synchronization. 

- **_client/_ (React.js Vite + Tailwind CSS + Interactive UI):** Contains the 3 role-based command centers (Farmer Geospatial Portal, Admin Satellite MRV & Minting Studio, and Corporate Buyer Carbon Marketplace), interactive **_React-Leaflet_** satellite maps, **_Recharts_** carbon analytics, and **_services/web3Client.js_** . 

## **3. Complete End-to-End System Flow (5-Stage Zero-Image Pipeline)** 

The entire VeriFlow Web 2.0 platform operates as a deterministic state machine driven by PostgreSQL status transitions ( **_SUBMITTED → VERIFIED → MINTED → SOLD → RETIRED_** ) synchronized with the Polygon Amoy blockchain. 

VeriFlow Web 2.0 — System Flow & Architectural Execution Blueprint 

Page 2 of 6 

#### **STAGE 1 Role Authentication & Web3 Wallet Binding** 

Users authenticate via JWT ( **_POST /api/auth/login_** ) or switch seamlessly between demo roles ( **Farmer** , **Admin Auditor** , **Corporate Buyer** ) during live presentations. Clicking _"Connect MetaMask"_ invokes 

**_window.ethereum.request({ method: 'eth_requestAccounts' })_** , verifies that the browser is connected to **Polygon Amoy Testnet (Chain ID 80002 / 0x13882)** , and binds the user's 42-character Ethereum address to their PostgreSQL profile. 

#### **STAGE 2 Zero-Image Geospatial Plot Registration (Farmer Portal)** 

Instead of uploading drone images, the Farmer interacts with an embedded **Interactive Satellite Map (ReactLeaflet with Esri World Imagery tiles)** . The Farmer either clicks directly on their coastal mangrove plantation on the map or clicks _"Detect Browser GPS"_ to auto-populate **_latitude_** and **_longitude_** . They select the dominant Blue Carbon mangrove species (e.g., _Rhizophora mucronata_ , _Avicennia marina_ , _Bruguiera gymnorhiza_ , or _Sonneratia alba_ ) and enter the plantation area in hectares ( **_area_hectares_** ). Submitting inserts a row into the PostgreSQL **_plots_** table with status **_SUBMITTED_** . 

#### **STAGE 3 Automated Satellite Remote Sensing & Carbon Sequestration Calculation (Admin MRV Studio)** 

The Admin opens the **MRV Verification Queue** and clicks _"Run Satellite Remote Sensing Analysis"_ on any **_SUBMITTED_** plot. The Node.js backend ( **_POST /api/plots/:id/verify-satellite_** ) reads the plot's exact **_(latitude, longitude, area_hectares, species)_** from PostgreSQL and executes the 4-step scientific calculation pipeline: 

1. **Satellite Telemetry Fetch:** Queries the open **NASA POWER Agro-Climatic Earth Observation API** for surface solar irradiance ( **_ALLSKY_SFC_SW_DWN_** ), coastal relative humidity ( **_RH2M_** ), and temperature at those exact coordinates. 

2. **Spectral Band & NDVI Derivation:** Derives Near-Infrared ( **_NIR_** ) and Red ( **_Red_** ) surface reflectance values to compute the Normalized Difference Vegetation Index ( **_NDVI_** ) and canopy coverage percentage. 

3. **IPCC Allometric Biomass Modeling:** Calculates Above-Ground Biomass ( **_AGB_** ), Below-Ground Root Biomass ( **_BGB_** ), and coastal Soil Organic Carbon ( **_SOC_** ) in **_Mg/ha_** . 

4. **PostgreSQL Persistence:** Inserts the complete telemetry record into the **_satellite_reports_** table and updates the plot status to **_VERIFIED_** . The Admin UI immediately renders interactive **Recharts** gauges showing NDVI health, biomass split, and total verified **_tCO2e_** . 

#### **STAGE 4 IPFS Metadata Pinning & On-Chain ERC-721 NFT Minting (Admin → Polygon Blockchain)** 

Once a plot is **_VERIFIED_** , the Admin clicks _"Approve & Mint Carbon Credit NFT"_ . First, the backend formats an OpenSea-standard ERC-721 metadata JSON containing the plot coordinates, mangrove species, satellite NDVI score, and verified carbon weight, pinning it to **IPFS (via Pinata API or deterministic IPFS CID generator)** . Second, the React frontend invokes **_contract.mintCarbonCredit(farmerWallet, carbonKg, priceWei, coords, tokenURI)_** via Ethers.js v6. MetaMask pops up in the browser; the Admin confirms the transaction; and once mined on Polygon Amoy, the **_token_id_** and **_mint_tx_hash_** are saved in the PostgreSQL **_nft_credits_** table with status **_MINTED_** . 

VeriFlow Web 2.0 — System Flow & Architectural Execution Blueprint 

Page 3 of 6 

#### **STAGE 5 Marketplace Trading, Automatic Farmer Payout & ESG Credit Retirement (Corporate Buyer)** 

All **_MINTED_** carbon credits appear automatically in the **Corporate Carbon Marketplace** with live satellite verification badges, PolygonScan transaction links, and pricing in both MATIC and USD equivalent. When a Corporate Buyer clicks _"Purchase Carbon Credit"_ , Ethers.js triggers **_contract.purchaseCredit(tokenId, { value: priceWei })_** . The Solidity smart contract atomically transfers the ERC-721 NFT from contract escrow to the buyer's wallet and forwards the MATIC payment directly to the Farmer's wallet. The buyer can then click _"Retire Credit for ESG Offset"_ to permanently lock the token on-chain ( **_RETIRED_** ) and download a verifiable PDF/HTML Carbon Offset Certificate. 

## **4. Scientific Mathematical Model Behind the Satellite MRV Engine** 

#### **Why This Wins Technical Interviews & Project Evaluations** 

Instead of claiming an unexplainable "black-box ML model," you can explain the exact physics, remote sensing indices, and IPCC environmental equations running in your backend. Evaluators love deterministic, mathematically grounded engineering. 

### **Equation 1: Normalized Difference Vegetation Index (** **_NDVI_ )** 

Healthy mangrove chlorophyll strongly absorbs visible Red light ( **_0.63–0.69 μm_** ) for photosynthesis while coastal leaf cellular structures strongly reflect Near-Infrared ( **_NIR_** , **_0.77–0.90 μm_** ) radiation: 



For dense coastal mangrove ecosystems, **_NDVI_** ranges between **_0.50_** and **_0.88_** , directly correlating with crown closure ( **_Canopy Cover % = min(98.5, NDVI × 112.4)_** ). 

### **Equation 2: Mangrove Above-Ground & Below-Ground Biomass (** **_AGB_ &** **_BGB_ )** 

Using the IPCC Coastal Wetlands Supplement and Komiyama allometric power-law relationship, Above-Ground Biomass ( **_AGB_** in metric tons of dry matter per hectare, **_Mg/ha_** ) is derived from **_NDVI_** and the species wooddensity factor **_Sf_** (e.g., **_1.12_** for _Rhizophora mucronata_ , **_0.96_** for _Avicennia marina_ ): 

### **_AGB = 185.0 × (NDVI)_**<sup>**_1.65_**</sup> **_× Sf_** and **_BGB = 0.42 × AGB_** 

Note that mangrove root systems ( **_BGB_** ) store an extraordinary **_42%_** of above-ground biomass beneath the waterline. 

### **Equation 3: Total Organic Carbon Rate & Stoichiometric** **_CO2e_ Conversion** 

Dry woody mangrove biomass is **_47%_** pure elemental Carbon by weight. Combining annual biomass accumulation ( **_8%_** net annual growth increment) with coastal anoxic Soil Organic Carbon sequestration ( **_SOCannual ≈ 6.1–7.2 Mg C/ha/yr_** ) and multiplying by the molecular weight ratio of **_CO2_** to Carbon ( **_44 / 12 ≈ 3.6667_** ) across plot area **_A_** (in hectares) yields total tradable carbon credits: 

VeriFlow Web 2.0 — System Flow & Architectural Execution Blueprint 

Page 4 of 6 

**_Cannual (Mg C/ha) = 0.47 × (AGB + BGB) × 0.08 + SOCannual_** 

### **_Net Sequestered CO2e (Metric Tons) = A × Cannual × 3.6667_** 

## **5. UI/UX Multiplier Strategy: Making the Web App Visually Striking** 

Because you emphasized making the UI/UX highly interactive and visually impressive, our React frontend incorporates five concrete design multipliers: 

1. **Obsidian & Bioluminescent Emerald Glassmorphic Theme:** Built with Tailwind CSS using deep slate backgrounds ( **_#020617_** , **_#0f172a_** ), semi-transparent frosted glass cards ( **_backdrop-blur-md bg-slate-900/70_** ), subtle glowing borders ( **_border-emerald-500/30_** ), and high-contrast typography. 

2. **Interactive Satellite Map Pin-Dropper (** **_React-Leaflet_ ):** Embeds live Esri World Satellite Imagery tiles directly inside the Farmer and Admin dashboards. Clicking anywhere on the coastal map drops an animated marker, draws a radius circle proportional to **_area_hectares_** , and auto-fills the GPS latitude and longitude inputs. 

3. **Satellite Telemetry Data Visualization Studio (** **_Recharts_ ):** Replaces plain numbers in the Admin Verification screen with an interactive 3-panel analytics view: (a) a Radial Bar Gauge for **_NDVI_** and Canopy Cover, (b) a Stacked Bar Chart comparing **_AGB_** , **_BGB_** , and **_SOC_** carbon pools against terrestrial forests, and (c) a 5-year Carbon Sequestration Projection curve. 

4. **Live Blockchain Transaction Stepper Modal:** When minting or buying an NFT, instead of a browser **_alert()_** , a sleek modal displays live step-by-step progress: _1. Pinning Satellite Proof to IPFS → 2. Awaiting MetaMask Signature → 3. Broadcasting to Polygon Amoy → 4. Synchronizing PostgreSQL Registry_ with a clickable PolygonScan link. 

5. **Instant On-Chain ESG Offset Certificate Generator:** When a buyer retires a carbon credit, the app renders a printable, gold-bordered **VeriFlow Blue Carbon Retirement Certificate** displaying the buyer's name, retired **_tCO2e_** volume, GPS mangrove coordinates, token ID, and immutable transaction hash. 

## **6. Step-by-Step Execution Plan (7-Phase Implementation Playbook)** 

|**Execution Phase**|**Actionable Engineering Tasks**|**Verification Milestone**|
|---|---|---|
|**Phase 1: Clean**<br>**Monorepo & Git**<br>**Setup**|Create**_veriflow-web-v2/_**outside the legacy mobile folder.<br>Initialize Git and create**_contracts/_**,**_server/_**, and**_client/_**directories.<br>Push initial structure to a new GitHub repo.|Clean Git status with zero React<br>Native / Expo packages.|
|**Phase 2:**|Create a free serverless PostgreSQL instance on**Neon.tech**(or|Tables visible in Neon SQL Editor;|
|**PostgreSQL Cloud**<br>**Database Setup**|Supabase). Run**_schema.sql_**to create**_users_**,**_plots_**,<br>**_satellite_reports_**, and**_nft_credits_**tables with seed records.|seed farmer & admin rows<br>queryable.|
|**Phase 3: Express**<br>**API & Satellite**<br>**Engine**|Build the Node.js + Express server with**_pg_**pool connection.<br>Implement**_satelliteMrvEngine.js_**(NASA POWER API +<br>deterministic geospatial fallback) and REST endpoints.|**_POST /api/plots/:id/verify-satellite_**<br>returns NDVI &**_tCO2e_**in <2s.|
|||Contract verified on<br>**_amoy.polygonscan.com_**.|



VeriFlow Web 2.0 — System Flow & Architectural Execution Blueprint 

Page 5 of 6 

|**Execution Phase**|**Actionable Engineering Tasks**|**Verification Milestone**|
|---|---|---|
|**Phase 4: Polygon**<br>**Smart Contract**<br>**Deployment**|Compile and deploy**_VeriFlowCarbonNFT.sol_**to**Polygon Amoy**<br>**Testnet**using Remix IDE or Hardhat. Copy the deployed<br>Contract Address and ABI JSON into the React app.||
|**Phase 5: React Vite**|Scaffold Vite React app with Tailwind CSS,**_lucide-react_**,**_react-_**|Clicking map auto-fills GPS|
|**UI & Map**|**_leaflet_**, and**_recharts_**. Build the interactive Map Picker, Admin|coordinates and renders satellite|
|**Integration**|Telemetry Studio, and Marketplace grid.|tiles.|
|**Phase 6: Ethers.js**|Connect**_web3Client.js_**to MetaMask (**_window.ethereum_**). Wire the|End-to-end flow from Plot|
|**v6 Blockchain**|Admin Mint button to**_mintCarbonCredit()_**and the Buyer button to|Registration to NFT purchase|
|**Wiring**|**_purchaseCredit()_**+**_retireCredit()_**.|works in browser.|
|**Phase 7: Cloud**|Deploy Express API to**Render.com**(connected to Neon|Live**_.vercel.app_**URL ready for your|
|**Deployment &**|PostgreSQL) and React Vite frontend to**Vercel**. Add 1-click|Resume and LinkedIn.|
|**Portfolio Polish**|Demo Role Switcher for recruiters testing without setup.||



VeriFlow Web 2.0 — System Flow & Architectural Execution Blueprint 

Page 6 of 6 

