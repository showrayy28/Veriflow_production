const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
let pool = null;
let useFallback = false;

// In-Memory Fallback State (initialized with seed data)
const fallbackStore = {
  users: [
    {
      id: 1,
      full_name: 'Ramesh Mondal (Coastal Farmer)',
      email: 'ramesh@sunderbans.in',
      password_hash: bcrypt.hashSync('farmer123', 10),
      role: 'farmer',
      wallet_address: '0x71C83D431a89c9d4b009FE543477F5B648834465',
      created_at: new Date('2026-01-10T10:00:00Z'),
    },
    {
      id: 2,
      full_name: 'Dr. Aris Thorne (MRV Lead Auditor)',
      email: 'admin@veriflow.org',
      password_hash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      wallet_address: '0x2546BcD3c84621e976D8185a91A922aE364C9FF3',
      created_at: new Date('2026-01-05T09:00:00Z'),
    },
    {
      id: 3,
      full_name: 'GreenFuture ESG Capital Corp',
      email: 'esg@greenfuture.com',
      password_hash: bcrypt.hashSync('buyer123', 10),
      role: 'buyer',
      wallet_address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      created_at: new Date('2026-01-15T14:30:00Z'),
    },
  ],
  plots: [
    {
      id: 1,
      farmer_id: 1,
      title: 'Sundarbans Delta Zone A-4 Blue Carbon',
      species: 'Rhizophora mucronata',
      area_hectares: 12.50,
      latitude: 21.949700,
      longitude: 89.183300,
      region_name: 'Sundarbans Biosphere Reserve, West Bengal',
      status: 'MINTED',
      created_at: new Date('2026-02-01T08:00:00Z'),
      updated_at: new Date('2026-02-05T12:00:00Z'),
    },
    {
      id: 2,
      farmer_id: 1,
      title: 'Bhitarkanika Tidal Wetland Restoration',
      species: 'Avicennia marina',
      area_hectares: 8.40,
      latitude: 20.728900,
      longitude: 86.868900,
      region_name: 'Bhitarkanika National Park, Odisha',
      status: 'VERIFIED',
      created_at: new Date('2026-02-10T11:00:00Z'),
      updated_at: new Date('2026-02-12T16:00:00Z'),
    },
    {
      id: 3,
      farmer_id: 1,
      title: 'Pichavaram Coastal Lagoon Mangrove Block',
      species: 'Bruguiera gymnorhiza',
      area_hectares: 5.00,
      latitude: 11.428900,
      longitude: 79.782000,
      region_name: 'Cuddalore Coastal District, Tamil Nadu',
      status: 'SUBMITTED',
      created_at: new Date('2026-02-18T09:30:00Z'),
      updated_at: new Date('2026-02-18T09:30:00Z'),
    },
    {
      id: 4,
      farmer_id: 1,
      title: 'Coringa Wildlife Sanctuary Mangrove Fringe',
      species: 'Sonneratia alba',
      area_hectares: 15.20,
      latitude: 16.750000,
      longitude: 82.250000,
      region_name: 'Kakinada Bay, Andhra Pradesh',
      status: 'RETIRED',
      created_at: new Date('2026-01-20T10:15:00Z'),
      updated_at: new Date('2026-02-14T18:00:00Z'),
    },
  ],
  satellite_reports: [
    {
      id: 1,
      plot_id: 1,
      ndvi_score: 0.7840,
      canopy_cover_pct: 88.12,
      solar_irradiance: 19.45,
      coastal_humidity: 84.30,
      agb_mg_per_ha: 142.60,
      bgb_mg_per_ha: 59.89,
      soc_mg_per_ha: 7.10,
      co2_tons_total: 664.25,
      carbon_kg_total: 664250,
      calculation_notes: 'Computed via NASA POWER Earth Observation + IPCC Tier-2 Coastal Wetlands model. Wood density factor Sf=1.12.',
      verified_at: new Date('2026-02-02T14:00:00Z'),
    },
    {
      id: 2,
      plot_id: 2,
      ndvi_score: 0.7210,
      canopy_cover_pct: 81.04,
      solar_irradiance: 20.10,
      coastal_humidity: 81.20,
      agb_mg_per_ha: 115.30,
      bgb_mg_per_ha: 48.43,
      soc_mg_per_ha: 6.80,
      co2_tons_total: 372.80,
      carbon_kg_total: 372800,
      calculation_notes: 'Computed via NASA POWER Earth Observation + IPCC Tier-2 Coastal Wetlands model. Wood density factor Sf=0.96.',
      verified_at: new Date('2026-02-12T16:00:00Z'),
    },
    {
      id: 3,
      plot_id: 4,
      ndvi_score: 0.8120,
      canopy_cover_pct: 91.27,
      solar_irradiance: 21.05,
      coastal_humidity: 86.40,
      agb_mg_per_ha: 153.20,
      bgb_mg_per_ha: 64.34,
      soc_mg_per_ha: 7.30,
      co2_tons_total: 891.40,
      carbon_kg_total: 891400,
      calculation_notes: 'Computed via NASA POWER Earth Observation + IPCC Tier-2 Coastal Wetlands model. Wood density factor Sf=1.05.',
      verified_at: new Date('2026-01-25T11:00:00Z'),
    },
  ],
  nft_credits: [
    {
      id: 1,
      plot_id: 1,
      token_id: 101,
      contract_address: '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb',
      farmer_wallet: '0x71C83D431a89c9d4b009FE543477F5B648834465',
      owner_wallet: '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb',
      price_matic: 0.2500,
      ipfs_metadata_uri: 'ipfs://bafkreiaw56g7s57jln7gqpxmty3u2uwr3f45u7c7y6j6w345v6j5q6v3y4',
      mint_tx_hash: '0x8b5b63cf2ea6fb4a36e9d72477fbb4eef10375dc012ef36e52c938b8aa834b1a',
      purchase_tx_hash: null,
      is_for_sale: true,
      is_retired: false,
      retired_at: null,
      retirement_beneficiary: null,
      created_at: new Date('2026-02-05T12:00:00Z'),
      updated_at: new Date('2026-02-05T12:00:00Z'),
    },
    {
      id: 2,
      plot_id: 4,
      token_id: 102,
      contract_address: '0x3565F438cf15D91444dE3D35B3B7075A0693a7eb',
      farmer_wallet: '0x71C83D431a89c9d4b009FE543477F5B648834465',
      owner_wallet: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      price_matic: 0.3500,
      ipfs_metadata_uri: 'ipfs://bafkreidv47d8w62jkn9fqpxmty3u2uwr3f45u7c7y6j6w345v6j5q6v4z9',
      mint_tx_hash: '0x9c6c74df3fb7ec5b47f0e83588fcc5ff021486ed123ef47f63d049c9bb945c2b',
      purchase_tx_hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
      is_for_sale: false,
      is_retired: true,
      retired_at: new Date('2026-02-14T18:00:00Z'),
      retirement_beneficiary: 'GreenFuture ESG Capital Corp - Net Zero 2026 Commitment',
      created_at: new Date('2026-01-28T10:00:00Z'),
      updated_at: new Date('2026-02-14T18:00:00Z'),
    },
  ],
};

if (connectionString) {
  const needsSsl = connectionString.includes('neon.tech') || 
                   connectionString.includes('sslmode=require') || 
                   process.env.NODE_ENV === 'production';

  pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('PostgreSQL Pool Error:', err.message);
  });
} else {
  console.log('ℹ️ [VeriFlow DB] DATABASE_URL not set in server/.env. Using resilient built-in store.');
  useFallback = true;
}

/**
 * Universal query runner: executes against PostgreSQL, or fallback store
 */
async function query(text, params = []) {
  if (pool && !useFallback) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('⚠️ PostgreSQL query failed, switching to memory fallback:', err.message);
      useFallback = true;
    }
  }

  // Fallback Query Engine
  const trimmed = text.trim();

  // 1. SELECT users by email
  if (trimmed.includes('FROM users') && trimmed.includes('WHERE email = $1')) {
    const email = params[0]?.toLowerCase();
    const user = fallbackStore.users.find((u) => u.email.toLowerCase() === email);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. INSERT into users
  if (trimmed.startsWith('INSERT INTO users')) {
    const newUser = {
      id: fallbackStore.users.length + 1,
      full_name: params[0],
      email: params[1],
      password_hash: params[2],
      role: params[3],
      wallet_address: params[4] || null,
      created_at: new Date(),
    };
    fallbackStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. UPDATE users wallet_address
  if (trimmed.includes('UPDATE users') && trimmed.includes('wallet_address')) {
    const wallet = params[0];
    const userId = params[1];
    const user = fallbackStore.users.find((u) => u.id === Number(userId));
    if (user) user.wallet_address = wallet;
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 4. SELECT plots (with optional filters, joins with users, reports, credits)
  if (trimmed.includes('FROM plots')) {
    // Single plot by ID
    const matchId = trimmed.match(/WHERE\s+p\.id\s*=\s*\$1/i) || trimmed.match(/WHERE\s+id\s*=\s*\$1/i);
    if (matchId) {
      const plotId = Number(params[0]);
      const p = fallbackStore.plots.find((item) => item.id === plotId);
      if (!p) return { rows: [], rowCount: 0 };
      const u = fallbackStore.users.find((u) => u.id === p.farmer_id);
      const r = fallbackStore.satellite_reports.find((r) => r.plot_id === p.id);
      const c = fallbackStore.nft_credits.find((c) => c.plot_id === p.id);
      const enriched = {
        ...p,
        farmer_name: u?.full_name || 'Verified Coastal Farmer',
        farmer_email: u?.email,
        farmer_wallet: u?.wallet_address,
        report: r || null,
        credit: c || null,
      };
      return { rows: [enriched], rowCount: 1 };
    }

    // List of plots
    let results = fallbackStore.plots.map((p) => {
      const u = fallbackStore.users.find((u) => u.id === p.farmer_id);
      const r = fallbackStore.satellite_reports.find((r) => r.plot_id === p.id);
      const c = fallbackStore.nft_credits.find((c) => c.plot_id === p.id);
      return {
        ...p,
        farmer_name: u?.full_name || 'Verified Coastal Farmer',
        farmer_email: u?.email,
        farmer_wallet: u?.wallet_address,
        report: r || null,
        credit: c || null,
      };
    });

    if (params.length > 0 && typeof params[0] === 'string') {
      const statusFilter = params[0].toUpperCase();
      if (['SUBMITTED', 'VERIFIED', 'MINTED', 'SOLD', 'RETIRED'].includes(statusFilter)) {
        results = results.filter((p) => p.status === statusFilter);
      }
    }

    return { rows: results, rowCount: results.length };
  }

  // 5. INSERT into plots
  if (trimmed.startsWith('INSERT INTO plots')) {
    const newPlot = {
      id: fallbackStore.plots.length + 1,
      farmer_id: Number(params[0]),
      title: params[1],
      species: params[2],
      area_hectares: Number(params[3]),
      latitude: Number(params[4]),
      longitude: Number(params[5]),
      region_name: params[6],
      status: 'SUBMITTED',
      created_at: new Date(),
      updated_at: new Date(),
    };
    fallbackStore.plots.push(newPlot);
    return { rows: [newPlot], rowCount: 1 };
  }

  // 6. UPDATE plots status
  if (trimmed.startsWith('UPDATE plots SET status = $1')) {
    const newStatus = params[0];
    const plotId = Number(params[1]);
    const p = fallbackStore.plots.find((item) => item.id === plotId);
    if (p) {
      p.status = newStatus;
      p.updated_at = new Date();
    }
    return { rows: p ? [p] : [], rowCount: p ? 1 : 0 };
  }

  // 7. INSERT into satellite_reports
  if (trimmed.startsWith('INSERT INTO satellite_reports')) {
    const plotId = Number(params[0]);
    // Remove old if any
    const existingIndex = fallbackStore.satellite_reports.findIndex((r) => r.plot_id === plotId);
    const newReport = {
      id: fallbackStore.satellite_reports.length + 1,
      plot_id: plotId,
      ndvi_score: Number(params[1]),
      canopy_cover_pct: Number(params[2]),
      solar_irradiance: Number(params[3]),
      coastal_humidity: Number(params[4]),
      agb_mg_per_ha: Number(params[5]),
      bgb_mg_per_ha: Number(params[6]),
      soc_mg_per_ha: Number(params[7]),
      co2_tons_total: Number(params[8]),
      carbon_kg_total: Number(params[9]),
      calculation_notes: params[10],
      verified_at: new Date(),
    };
    if (existingIndex >= 0) {
      fallbackStore.satellite_reports[existingIndex] = newReport;
    } else {
      fallbackStore.satellite_reports.push(newReport);
    }
    // Also update plot status to VERIFIED
    const p = fallbackStore.plots.find((item) => item.id === plotId);
    if (p) p.status = 'VERIFIED';
    return { rows: [newReport], rowCount: 1 };
  }

  // 8. INSERT into nft_credits
  if (trimmed.startsWith('INSERT INTO nft_credits')) {
    const plotId = Number(params[0]);
    const newCredit = {
      id: fallbackStore.nft_credits.length + 1,
      plot_id: plotId,
      token_id: Number(params[1]),
      contract_address: params[2],
      farmer_wallet: params[3],
      owner_wallet: params[4] || params[2],
      price_matic: Number(params[5]),
      ipfs_metadata_uri: params[6],
      mint_tx_hash: params[7],
      purchase_tx_hash: null,
      is_for_sale: true,
      is_retired: false,
      retired_at: null,
      retirement_beneficiary: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    fallbackStore.nft_credits.push(newCredit);
    const p = fallbackStore.plots.find((item) => item.id === plotId);
    if (p) p.status = 'MINTED';
    return { rows: [newCredit], rowCount: 1 };
  }

  // 9. UPDATE nft_credits (purchase / retirement)
  if (trimmed.includes('UPDATE nft_credits')) {
    const plotId = Number(params[params.length - 1]);
    const credit = fallbackStore.nft_credits.find((c) => c.plot_id === plotId);
    if (credit) {
      if (trimmed.includes('is_retired = true')) {
        credit.is_retired = true;
        credit.is_for_sale = false;
        credit.retired_at = new Date();
        credit.retirement_beneficiary = params[0] || 'Anonymous ESG Offsetter';
      } else if (trimmed.includes('purchase_tx_hash')) {
        credit.owner_wallet = params[0];
        credit.purchase_tx_hash = params[1];
        credit.is_for_sale = false;
        credit.updated_at = new Date();
      }
    }
    return { rows: credit ? [credit] : [], rowCount: credit ? 1 : 0 };
  }

  // Generic fallback: return empty result
  return { rows: [], rowCount: 0 };
}

module.exports = {
  pool,
  query,
  fallbackStore,
};
