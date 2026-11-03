const db = require('../config/db');

/**
 * GET /api/plots
 * Query filters: status, species, farmer_id
 */
async function listPlots(req, res) {
  try {
    const { status, species } = req.query;

    let queryText = `
      SELECT 
        p.*,
        u.full_name AS farmer_name,
        u.email AS farmer_email,
        u.wallet_address AS farmer_wallet,
        r.id AS report_id,
        r.ndvi_score,
        r.canopy_cover_pct,
        r.solar_irradiance,
        r.coastal_humidity,
        r.agb_mg_per_ha,
        r.bgb_mg_per_ha,
        r.soc_mg_per_ha,
        r.co2_tons_total,
        r.carbon_kg_total,
        r.verified_at,
        c.id AS credit_id,
        c.token_id,
        c.contract_address,
        c.owner_wallet,
        c.price_matic,
        c.ipfs_metadata_uri,
        c.mint_tx_hash,
        c.purchase_tx_hash,
        c.is_for_sale,
        c.is_retired,
        c.retired_at,
        c.retirement_beneficiary
      FROM plots p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN satellite_reports r ON r.plot_id = p.id
      LEFT JOIN nft_credits c ON c.plot_id = p.id
      WHERE 1=1
    `;

    const params = [];
    if (status) {
      params.push(status.toUpperCase());
      queryText += ` AND p.status = $${params.length}`;
    }
    if (species) {
      params.push(species);
      queryText += ` AND p.species = $${params.length}`;
    }

    queryText += ` ORDER BY p.created_at DESC`;

    const result = await db.query(queryText, params);

    // Format nested report and credit objects if present
    const plots = result.rows.map((row) => {
      const hasReport = row.ndvi_score !== null && row.ndvi_score !== undefined;
      const hasCredit = row.token_id !== null && row.token_id !== undefined;

      return {
        id: row.id,
        farmer_id: row.farmer_id,
        farmer_name: row.farmer_name,
        farmer_email: row.farmer_email,
        farmer_wallet: row.farmer_wallet,
        title: row.title,
        species: row.species,
        area_hectares: Number(row.area_hectares),
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        region_name: row.region_name,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        report: hasReport
          ? {
              id: row.report_id,
              ndvi_score: Number(row.ndvi_score),
              canopy_cover_pct: Number(row.canopy_cover_pct),
              solar_irradiance: Number(row.solar_irradiance),
              coastal_humidity: Number(row.coastal_humidity),
              agb_mg_per_ha: Number(row.agb_mg_per_ha),
              bgb_mg_per_ha: Number(row.bgb_mg_per_ha),
              soc_mg_per_ha: Number(row.soc_mg_per_ha),
              co2_tons_total: Number(row.co2_tons_total),
              carbon_kg_total: Number(row.carbon_kg_total),
              verified_at: row.verified_at,
            }
          : null,
        credit: hasCredit
          ? {
              id: row.credit_id,
              token_id: row.token_id,
              contract_address: row.contract_address,
              owner_wallet: row.owner_wallet,
              price_matic: Number(row.price_matic),
              ipfs_metadata_uri: row.ipfs_metadata_uri,
              mint_tx_hash: row.mint_tx_hash,
              purchase_tx_hash: row.purchase_tx_hash,
              is_for_sale: row.is_for_sale,
              is_retired: row.is_retired,
              retired_at: row.retired_at,
              retirement_beneficiary: row.retirement_beneficiary,
            }
          : null,
      };
    });

    return res.json({ success: true, count: plots.length, data: plots });
  } catch (error) {
    console.error('List plots error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/plots/:id
 */
async function getPlotById(req, res) {
  try {
    const plotId = parseInt(req.params.id, 10);
    if (isNaN(plotId)) {
      return res.status(400).json({ success: false, message: 'Invalid plot ID.' });
    }

    const queryText = `
      SELECT 
        p.*,
        u.full_name AS farmer_name,
        u.email AS farmer_email,
        u.wallet_address AS farmer_wallet,
        r.id AS report_id,
        r.ndvi_score,
        r.canopy_cover_pct,
        r.solar_irradiance,
        r.coastal_humidity,
        r.agb_mg_per_ha,
        r.bgb_mg_per_ha,
        r.soc_mg_per_ha,
        r.co2_tons_total,
        r.carbon_kg_total,
        r.calculation_notes,
        r.verified_at,
        c.id AS credit_id,
        c.token_id,
        c.contract_address,
        c.owner_wallet,
        c.price_matic,
        c.ipfs_metadata_uri,
        c.mint_tx_hash,
        c.purchase_tx_hash,
        c.is_for_sale,
        c.is_retired,
        c.retired_at,
        c.retirement_beneficiary
      FROM plots p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN satellite_reports r ON r.plot_id = p.id
      LEFT JOIN nft_credits c ON c.plot_id = p.id
      WHERE p.id = $1
    `;

    const result = await db.query(queryText, [plotId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Plot with ID ${plotId} not found.` });
    }

    const row = result.rows[0];
    const hasReport = row.ndvi_score !== null && row.ndvi_score !== undefined;
    const hasCredit = row.token_id !== null && row.token_id !== undefined;

    const plot = {
      id: row.id,
      farmer_id: row.farmer_id,
      farmer_name: row.farmer_name,
      farmer_email: row.farmer_email,
      farmer_wallet: row.farmer_wallet,
      title: row.title,
      species: row.species,
      area_hectares: Number(row.area_hectares),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      region_name: row.region_name,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      report: hasReport
        ? {
            id: row.report_id,
            ndvi_score: Number(row.ndvi_score),
            canopy_cover_pct: Number(row.canopy_cover_pct),
            solar_irradiance: Number(row.solar_irradiance),
            coastal_humidity: Number(row.coastal_humidity),
            agb_mg_per_ha: Number(row.agb_mg_per_ha),
            bgb_mg_per_ha: Number(row.bgb_mg_per_ha),
            soc_mg_per_ha: Number(row.soc_mg_per_ha),
            co2_tons_total: Number(row.co2_tons_total),
            carbon_kg_total: Number(row.carbon_kg_total),
            calculation_notes: row.calculation_notes,
            verified_at: row.verified_at,
          }
        : null,
      credit: hasCredit
        ? {
            id: row.credit_id,
            token_id: row.token_id,
            contract_address: row.contract_address,
            owner_wallet: row.owner_wallet,
            price_matic: Number(row.price_matic),
            ipfs_metadata_uri: row.ipfs_metadata_uri,
            mint_tx_hash: row.mint_tx_hash,
            purchase_tx_hash: row.purchase_tx_hash,
            is_for_sale: row.is_for_sale,
            is_retired: row.is_retired,
            retired_at: row.retired_at,
            retirement_beneficiary: row.retirement_beneficiary,
          }
        : null,
    };

    return res.json({ success: true, data: plot });
  } catch (error) {
    console.error('Get plot error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/plots
 * Body: { title, species, area_hectares, latitude, longitude, region_name }
 */
async function createPlot(req, res) {
  try {
    const { title, species, area_hectares, latitude, longitude, region_name } = req.body;

    if (!title || !species || !area_hectares || latitude === undefined || longitude === undefined || !region_name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, species, area_hectares, latitude, longitude, region_name.',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const area = parseFloat(area_hectares);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: 'Latitude must be a valid float between -90 and 90.' });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: 'Longitude must be a valid float between -180 and 180.' });
    }
    if (isNaN(area) || area <= 0) {
      return res.status(400).json({ success: false, message: 'Area in hectares must be greater than 0.' });
    }

    // Determine farmer_id: from authenticated user or fallback to demo farmer (id 1)
    const farmerId = req.user ? req.user.id : 1;

    const insertSql = `
      INSERT INTO plots (farmer_id, title, species, area_hectares, latitude, longitude, region_name, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUBMITTED')
      RETURNING *
    `;

    const result = await db.query(insertSql, [farmerId, title.trim(), species.trim(), area, lat, lng, region_name.trim()]);
    const createdPlot = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Mangrove plot registered successfully with status SUBMITTED.',
      data: createdPlot,
    });
  } catch (error) {
    console.error('Create plot error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  listPlots,
  getPlotById,
  createPlot,
};
