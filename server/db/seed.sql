-- =========================================================
-- VeriFlow Web 2.0 PostgreSQL Seed Data
-- Demo Users, Mangrove Plots, MRV Satellite Reports & NFT Credits
-- =========================================================

-- Note on Passwords:
-- Admin:    admin@veriflow.org       / password: admin123   (bcrypt hash below)
-- Farmer:   ramesh@sunderbans.in     / password: farmer123  (bcrypt hash below)
-- Buyer:    esg@greenfuture.com      / password: buyer123   (bcrypt hash below)

-- 1. Demo Users
INSERT INTO users (id, full_name, email, password_hash, role, wallet_address)
VALUES
    (1, 'Ramesh Mondal (Coastal Farmer)', 'ramesh@sunderbans.in', '$2a$10$K4rB9/PqvD8oHw1j4VvXbuuL2.W56xH8Q2aR/V8e2bO8L6L8t2e6G', 'farmer', '0x71C83D431a89c9d4b009FE543477F5B648834465'),
    (2, 'Dr. Aris Thorne (MRV Lead Auditor)', 'admin@veriflow.org', '$2a$10$w850cKq79B0hW7WpL9g1v.eO8g6O1k7a0hBqN7nZ0u0N7L7o8R/2m', 'admin', '0x2546BcD3c84621e976D8185a91A922aE364C9FF3'),
    (3, 'GreenFuture ESG Capital Corp', 'esg@greenfuture.com', '$2a$10$e9O3v.k7a0hBqN7nZ0u0N7L7o8R/2mw850cKq79B0hW7WpL9g1v.O', 'buyer', '0x90F79bf6EB2c4f870365E785982E1f101E93b906')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    wallet_address = EXCLUDED.wallet_address;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. Demo Plots in various lifecycle stages
INSERT INTO plots (id, farmer_id, title, species, area_hectares, latitude, longitude, region_name, status)
VALUES
    -- Plot 1: Sundarbans Delta (MINTED & Listed on Marketplace)
    (1, 1, 'Sundarbans Delta Zone A-4 Blue Carbon', 'Rhizophora mucronata', 12.50, 21.949700, 89.183300, 'Sundarbans Biosphere Reserve, West Bengal', 'MINTED'),
    
    -- Plot 2: Bhitarkanika Estuary (VERIFIED by Satellite, Ready to Mint)
    (2, 1, 'Bhitarkanika Tidal Wetland Restoration', 'Avicennia marina', 8.40, 20.728900, 86.868900, 'Bhitarkanika National Park, Odisha', 'VERIFIED'),
    
    -- Plot 3: Pichavaram Mangrove Estuary (SUBMITTED, in Verification Queue)
    (3, 1, 'Pichavaram Coastal Lagoon Mangrove Block', 'Bruguiera gymnorhiza', 5.00, 11.428900, 79.782000, 'Cuddalore Coastal District, Tamil Nadu', 'SUBMITTED'),

    -- Plot 4: Godavari Delta (RETIRED for ESG Offset)
    (4, 1, 'Coringa Wildlife Sanctuary Mangrove Fringe', 'Sonneratia alba', 15.20, 16.750000, 82.250000, 'Kakinada Bay, Andhra Pradesh', 'RETIRED')
ON CONFLICT (id) DO UPDATE SET
    farmer_id = EXCLUDED.farmer_id,
    title = EXCLUDED.title,
    species = EXCLUDED.species,
    area_hectares = EXCLUDED.area_hectares,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    region_name = EXCLUDED.region_name,
    status = EXCLUDED.status;

SELECT setval('plots_id_seq', (SELECT MAX(id) FROM plots));

-- 3. Satellite Telemetry Reports (for Verified, Minted, and Retired plots)
INSERT INTO satellite_reports (id, plot_id, ndvi_score, canopy_cover_pct, solar_irradiance, coastal_humidity, agb_mg_per_ha, bgb_mg_per_ha, soc_mg_per_ha, co2_tons_total, carbon_kg_total, calculation_notes)
VALUES
    -- Report for Plot 1
    (1, 1, 0.7840, 88.12, 19.45, 84.30, 142.60, 59.89, 7.10, 664.25, 664250, 'Computed via NASA POWER Earth Observation + IPCC Tier-2 Coastal Wetlands model. Wood density factor Sf=1.12.'),
    
    -- Report for Plot 2
    (2, 2, 0.7210, 81.04, 20.10, 81.20, 115.30, 48.43, 6.80, 372.80, 372800, 'Computed via NASA POWER Earth Observation + IPCC Tier-2 Coastal Wetlands model. Wood density factor Sf=0.96.'),
    
    -- Report for Plot 4
    (3, 4, 0.8120, 91.27, 21.05, 86.40, 153.20, 64.34, 7.30, 891.40, 891400, 'Computed via NASA POWER Earth Observation + IPCC Tier-2 Coastal Wetlands model. Wood density factor Sf=1.05.')
ON CONFLICT (id) DO UPDATE SET
    plot_id = EXCLUDED.plot_id,
    ndvi_score = EXCLUDED.ndvi_score,
    canopy_cover_pct = EXCLUDED.canopy_cover_pct,
    solar_irradiance = EXCLUDED.solar_irradiance,
    coastal_humidity = EXCLUDED.coastal_humidity,
    agb_mg_per_ha = EXCLUDED.agb_mg_per_ha,
    bgb_mg_per_ha = EXCLUDED.bgb_mg_per_ha,
    soc_mg_per_ha = EXCLUDED.soc_mg_per_ha,
    co2_tons_total = EXCLUDED.co2_tons_total,
    carbon_kg_total = EXCLUDED.carbon_kg_total,
    calculation_notes = EXCLUDED.calculation_notes;

SELECT setval('satellite_reports_id_seq', (SELECT MAX(id) FROM satellite_reports));

-- 4. NFT Credits (for Minted and Retired plots)
INSERT INTO nft_credits (id, plot_id, token_id, contract_address, farmer_wallet, owner_wallet, price_matic, ipfs_metadata_uri, mint_tx_hash, purchase_tx_hash, is_for_sale, is_retired, retired_at, retirement_beneficiary)
VALUES
    -- NFT for Plot 1 (For Sale on Marketplace)
    (1, 1, 101, '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb', '0x71C83D431a89c9d4b009FE543477F5B648834465', '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb', 0.2500, 'ipfs://bafkreiaw56g7s57jln7gqpxmty3u2uwr3f45u7c7y6j6w345v6j5q6v3y4', '0x8b5b63cf2ea6fb4a36e9d72477fbb4eef10375dc012ef36e52c938b8aa834b1a', NULL, true, false, NULL, NULL),
    
    -- NFT for Plot 4 (Retired for ESG by GreenFuture Corp)
    (2, 4, 102, '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb', '0x71C83D431a89c9d4b009FE543477F5B648834465', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 0.3500, 'ipfs://bafkreidv47d8w62jkn9fqpxmty3u2uwr3f45u7c7y6j6w345v6j5q6v4z9', '0x9c6c74df3fb7ec5b47f0e83588fcc5ff021486ed123ef47f63d049c9bb945c2b', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', false, true, CURRENT_TIMESTAMP - INTERVAL '2 days', 'GreenFuture ESG Capital Corp - Net Zero 2026 Commitment')
ON CONFLICT (id) DO UPDATE SET
    plot_id = EXCLUDED.plot_id,
    token_id = EXCLUDED.token_id,
    contract_address = EXCLUDED.contract_address,
    farmer_wallet = EXCLUDED.farmer_wallet,
    owner_wallet = EXCLUDED.owner_wallet,
    price_matic = EXCLUDED.price_matic,
    ipfs_metadata_uri = EXCLUDED.ipfs_metadata_uri,
    mint_tx_hash = EXCLUDED.mint_tx_hash,
    purchase_tx_hash = EXCLUDED.purchase_tx_hash,
    is_for_sale = EXCLUDED.is_for_sale,
    is_retired = EXCLUDED.is_retired,
    retired_at = EXCLUDED.retired_at,
    retirement_beneficiary = EXCLUDED.retirement_beneficiary;

SELECT setval('nft_credits_id_seq', (SELECT MAX(id) FROM nft_credits));
