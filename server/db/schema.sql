-- =========================================================
-- VeriFlow Web 2.0 PostgreSQL Database Schema
-- Blue Carbon MRV Registry & Web3 Marketplace
-- =========================================================

-- Enable UUID extension if needed (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Farmers, MRV Admin Auditors, ESG Buyers)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('farmer', 'admin', 'buyer')),
    wallet_address VARCHAR(42),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mangrove Plantation Plots Table
CREATE TABLE IF NOT EXISTS plots (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    species VARCHAR(100) NOT NULL,
    area_hectares NUMERIC(10, 2) NOT NULL CHECK (area_hectares > 0),
    latitude NUMERIC(9, 6) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC(9, 6) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    region_name VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' 
        CHECK (status IN ('SUBMITTED', 'VERIFIED', 'MINTED', 'SOLD', 'RETIRED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Satellite Remote Sensing Telemetry & MRV Reports
CREATE TABLE IF NOT EXISTS satellite_reports (
    id SERIAL PRIMARY KEY,
    plot_id INTEGER UNIQUE NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
    ndvi_score NUMERIC(5, 4) NOT NULL CHECK (ndvi_score >= -1.0 AND ndvi_score <= 1.0),
    canopy_cover_pct NUMERIC(5, 2) NOT NULL CHECK (canopy_cover_pct >= 0 AND canopy_cover_pct <= 100),
    solar_irradiance NUMERIC(6, 2) NOT NULL,
    coastal_humidity NUMERIC(5, 2) NOT NULL,
    agb_mg_per_ha NUMERIC(10, 2) NOT NULL,
    bgb_mg_per_ha NUMERIC(10, 2) NOT NULL,
    soc_mg_per_ha NUMERIC(10, 2) NOT NULL,
    co2_tons_total NUMERIC(12, 2) NOT NULL,
    carbon_kg_total BIGINT NOT NULL,
    calculation_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. On-Chain ERC-721 Carbon Credits & Marketplace State
CREATE TABLE IF NOT EXISTS nft_credits (
    id SERIAL PRIMARY KEY,
    plot_id INTEGER UNIQUE NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
    token_id INTEGER NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    farmer_wallet VARCHAR(42) NOT NULL,
    owner_wallet VARCHAR(42) NOT NULL,
    price_matic NUMERIC(12, 4) NOT NULL CHECK (price_matic >= 0),
    ipfs_metadata_uri TEXT NOT NULL,
    mint_tx_hash VARCHAR(66) NOT NULL,
    purchase_tx_hash VARCHAR(66),
    is_for_sale BOOLEAN NOT NULL DEFAULT true,
    is_retired BOOLEAN NOT NULL DEFAULT false,
    retired_at TIMESTAMP WITH TIME ZONE,
    retirement_beneficiary VARCHAR(180),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_plots_farmer_id ON plots(farmer_id);
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
CREATE INDEX IF NOT EXISTS idx_satellite_reports_plot_id ON satellite_reports(plot_id);
CREATE INDEX IF NOT EXISTS idx_nft_credits_plot_id ON nft_credits(plot_id);
CREATE INDEX IF NOT EXISTS idx_nft_credits_token_id ON nft_credits(token_id);
CREATE INDEX IF NOT EXISTS idx_nft_credits_is_for_sale ON nft_credits(is_for_sale);
CREATE INDEX IF NOT EXISTS idx_nft_credits_is_retired ON nft_credits(is_retired);
