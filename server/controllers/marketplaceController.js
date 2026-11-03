const db = require('../config/db');
const { pinMetadataToIPFS, buildCarbonCreditMetadata } = require('../services/ipfsPinataService');

/**
 * POST /api/plots/:id/prepare-mint
 * Builds OpenSea/ERC-721 metadata and pins to IPFS
 */
async function prepareMint(req, res) {
  try {
    const plotId = parseInt(req.params.id, 10);
    const { price_matic, farmer_wallet } = req.body;

    // Fetch plot and verified satellite report
    const plotRes = await db.query('SELECT * FROM plots WHERE id = $1', [plotId]);
    if (plotRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plot not found.' });
    }
    const plot = plotRes.rows[0];

    const reportRes = await db.query('SELECT * FROM satellite_reports WHERE plot_id = $1', [plotId]);
    if (reportRes.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Plot must be verified by satellite MRV before minting.' });
    }
    const report = reportRes.rows[0];

    // Build standard metadata
    const metadata = buildCarbonCreditMetadata({
      plot,
      report,
      farmerWallet: farmer_wallet || plot.farmer_wallet || '0x71C83D431a89c9d4b009FE543477F5B648834465',
      priceMatic: price_matic || 0.25,
    });

    // Pin to IPFS
    const pinResult = await pinMetadataToIPFS(metadata);

    return res.json({
      success: true,
      message: 'ERC-721 metadata prepared and pinned to IPFS.',
      ipfs_uri: pinResult.ipfsUri,
      gateway_url: pinResult.gatewayUrl,
      provider: pinResult.provider,
      metadata,
      carbon_kg: Number(report.carbon_kg_total),
      co2_tons: Number(report.co2_tons_total),
    });
  } catch (error) {
    console.error('Prepare mint error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/plots/:id/record-mint
 * Synchronizes on-chain mint event with PostgreSQL
 */
async function recordMint(req, res) {
  try {
    const plotId = parseInt(req.params.id, 10);
    const { token_id, contract_address, farmer_wallet, price_matic, ipfs_metadata_uri, mint_tx_hash } = req.body;

    if (!token_id || !contract_address || !farmer_wallet || !price_matic || !ipfs_metadata_uri || !mint_tx_hash) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: token_id, contract_address, farmer_wallet, price_matic, ipfs_metadata_uri, mint_tx_hash',
      });
    }

    // Check if plot is already minted (NFR-3 double minting prevention)
    const existing = await db.query('SELECT * FROM nft_credits WHERE plot_id = $1', [plotId]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'This plot has already been minted as an NFT credit.' });
    }

    const insertSql = `
      INSERT INTO nft_credits (
        plot_id, token_id, contract_address, farmer_wallet, owner_wallet,
        price_matic, ipfs_metadata_uri, mint_tx_hash, is_for_sale, is_retired
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, false)
      RETURNING *
    `;

    // By default, when minted into escrow, owner_wallet is initially contract_address
    const creditResult = await db.query(insertSql, [
      plotId,
      token_id,
      contract_address,
      farmer_wallet,
      contract_address,
      price_matic,
      ipfs_metadata_uri,
      mint_tx_hash,
    ]);

    // Update plot status to MINTED
    await db.query('UPDATE plots SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['MINTED', plotId]);

    return res.status(201).json({
      success: true,
      message: 'On-chain NFT mint recorded successfully. Plot is now listed on Marketplace.',
      data: creditResult.rows[0],
    });
  } catch (error) {
    console.error('Record mint error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/plots/:id/record-purchase
 * Updates credit ownership upon on-chain purchase
 */
async function recordPurchase(req, res) {
  try {
    const plotId = parseInt(req.params.id, 10);
    const { buyer_wallet, purchase_tx_hash, retire_immediately, beneficiary } = req.body;

    if (!buyer_wallet || !purchase_tx_hash) {
      return res.status(400).json({ success: false, message: 'buyer_wallet and purchase_tx_hash are required.' });
    }

    const updateCreditSql = `
      UPDATE nft_credits 
      SET owner_wallet = $1,
          purchase_tx_hash = $2,
          is_for_sale = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE plot_id = $3
      RETURNING *
    `;

    const creditResult = await db.query(updateCreditSql, [buyer_wallet, purchase_tx_hash, plotId]);
    if (creditResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'NFT credit for this plot not found.' });
    }

    const targetStatus = retire_immediately ? 'RETIRED' : 'SOLD';
    await db.query('UPDATE plots SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [targetStatus, plotId]);

    if (retire_immediately) {
      await db.query(
        'UPDATE nft_credits SET is_retired = true, retired_at = CURRENT_TIMESTAMP, retirement_beneficiary = $1 WHERE plot_id = $2',
        [beneficiary || 'Anonymous Corporate Offsetter', plotId]
      );
    }

    return res.json({
      success: true,
      message: `Purchase recorded successfully. Status updated to ${targetStatus}.`,
      data: creditResult.rows[0],
    });
  } catch (error) {
    console.error('Record purchase error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/plots/:id/retire
 * Permanently retires a purchased carbon credit for ESG offset
 */
async function retireCredit(req, res) {
  try {
    const plotId = parseInt(req.params.id, 10);
    const { beneficiary, retire_tx_hash } = req.body;

    const retireSql = `
      UPDATE nft_credits
      SET is_retired = true,
          is_for_sale = false,
          retired_at = CURRENT_TIMESTAMP,
          retirement_beneficiary = $1
      WHERE plot_id = $2
      RETURNING *
    `;

    const result = await db.query(retireSql, [beneficiary || 'Anonymous Corporate ESG Offsetter', plotId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'NFT credit not found.' });
    }

    await db.query('UPDATE plots SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['RETIRED', plotId]);

    // Fetch full plot + report info for certificate generation
    const plotRes = await db.query('SELECT * FROM plots WHERE id = $1', [plotId]);
    const reportRes = await db.query('SELECT * FROM satellite_reports WHERE plot_id = $1', [plotId]);

    const certificate = {
      certificate_id: `VF-ESG-${plotId}-${Date.now().toString(36).toUpperCase()}`,
      plot: plotRes.rows[0],
      report: reportRes.rows[0],
      credit: result.rows[0],
      beneficiary: beneficiary || 'Corporate ESG Partner',
      retired_at: new Date().toISOString(),
      blockchain: 'Polygon Amoy Testnet (Chain ID 80002)',
      retire_tx_hash: retire_tx_hash || '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    };

    return res.json({
      success: true,
      message: 'Carbon credit successfully retired for ESG compliance. Certificate generated.',
      certificate,
    });
  } catch (error) {
    console.error('Retire credit error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/marketplace/stats
 * Overview analytics for marketplace dashboard
 */
async function getMarketplaceStats(req, res) {
  try {
    const plotsRes = await db.query('SELECT COUNT(*) AS total_plots, SUM(area_hectares) AS total_hectares FROM plots');
    const verifiedRes = await db.query('SELECT SUM(co2_tons_total) AS total_co2e, SUM(carbon_kg_total) AS total_carbon_kg FROM satellite_reports');
    const creditsRes = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_for_sale = true) AS active_listings,
        COUNT(*) FILTER (WHERE is_retired = true) AS retired_count,
        SUM(price_matic) AS total_volume_matic
      FROM nft_credits
    `);

    const stats = {
      totalPlots: Number(plotsRes.rows[0]?.total_plots || 0),
      totalHectares: Number(plotsRes.rows[0]?.total_hectares || 0).toFixed(1),
      totalCo2eTons: Number(verifiedRes.rows[0]?.total_co2e || 0).toFixed(2),
      totalCarbonKg: Number(verifiedRes.rows[0]?.total_carbon_kg || 0),
      activeListings: Number(creditsRes.rows[0]?.active_listings || 0),
      retiredCount: Number(creditsRes.rows[0]?.retired_count || 0),
      totalVolumeMatic: Number(creditsRes.rows[0]?.total_volume_matic || 0).toFixed(2),
      maticToUsdRate: 0.58, // Real-world benchmark
    };

    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Marketplace stats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  prepareMint,
  recordMint,
  recordPurchase,
  retireCredit,
  getMarketplaceStats,
};
