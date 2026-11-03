const db = require('../config/db');
const { computeSatelliteMRV } = require('../services/satelliteMrvEngine');

/**
 * POST /api/plots/:id/verify-satellite
 * Executes zero-image NASA Earth Observation remote sensing analysis
 * and IPCC Tier-2 Allometric biomass modeling on the target plot.
 */
async function verifyPlotSatellite(req, res) {
  try {
    const plotId = parseInt(req.params.id, 10);
    if (isNaN(plotId)) {
      return res.status(400).json({ success: false, message: 'Invalid plot ID.' });
    }

    // 1. Fetch plot details
    const plotResult = await db.query('SELECT * FROM plots WHERE id = $1', [plotId]);
    if (plotResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Plot with ID ${plotId} not found.` });
    }

    const plot = plotResult.rows[0];

    // 2. Execute Satellite MRV Engine
    console.log(`🛰️ Initiating Satellite Remote Sensing for Plot #${plotId} (${plot.title}) at [${plot.latitude}, ${plot.longitude}]...`);
    const mrvData = await computeSatelliteMRV({
      latitude: plot.latitude,
      longitude: plot.longitude,
      areaHectares: plot.area_hectares,
      species: plot.species,
    });

    const { metrics, telemetry, calculationNotes, projections } = mrvData;

    // 3. Persist Telemetry Report in PostgreSQL
    const insertReportSql = `
      INSERT INTO satellite_reports (
        plot_id, ndvi_score, canopy_cover_pct, solar_irradiance, coastal_humidity,
        agb_mg_per_ha, bgb_mg_per_ha, soc_mg_per_ha, co2_tons_total, carbon_kg_total, calculation_notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const reportResult = await db.query(insertReportSql, [
      plotId,
      metrics.ndviScore,
      metrics.canopyCoverPct,
      telemetry.solarIrradiance,
      telemetry.coastalHumidity,
      metrics.agbMgPerHa,
      metrics.bgbMgPerHa,
      metrics.socMgPerHa,
      metrics.co2TonsTotal,
      metrics.carbonKgTotal,
      calculationNotes,
    ]);

    // 4. Update plot status to VERIFIED
    await db.query('UPDATE plots SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['VERIFIED', plotId]);

    console.log(`✅ Plot #${plotId} successfully verified! NDVI: ${metrics.ndviScore}, tCO2e: ${metrics.co2TonsTotal}`);

    return res.json({
      success: true,
      message: 'Satellite remote sensing analysis completed and verified successfully.',
      plot_id: plotId,
      status: 'VERIFIED',
      report: reportResult.rows[0],
      projections,
      telemetry,
    });
  } catch (error) {
    console.error('Satellite verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete satellite remote sensing analysis.',
      error: error.message,
    });
  }
}

module.exports = {
  verifyPlotSatellite,
};
