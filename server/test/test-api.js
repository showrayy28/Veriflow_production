const { computeSatelliteMRV } = require('../services/satelliteMrvEngine');
const { pinMetadataToIPFS, buildCarbonCreditMetadata } = require('../services/ipfsPinataService');
const db = require('../config/db');

async function runTests() {
  console.log('🧪 Starting VeriFlow Backend & MRV Engine Integration Tests...\n');

  // Test 1: Database queries
  console.log('1️⃣ Testing Database Queries...');
  const plots = await db.query('SELECT * FROM plots');
  if (plots.rows.length === 0) throw new Error('No plots loaded');
  console.log(`✅ Loaded ${plots.rows.length} plots from database.`);

  // Test 2: Satellite MRV Calculation
  console.log('\n2️⃣ Testing Satellite MRV Engine (Sundarbans Delta Lat: 21.9497, Lng: 89.1833)...');
  const startMrv = Date.now();
  const mrv = await computeSatelliteMRV({
    latitude: 21.9497,
    longitude: 89.1833,
    areaHectares: 12.5,
    species: 'Rhizophora mucronata',
  });
  const mrvTime = Date.now() - startMrv;
  console.log(`✅ Satellite MRV completed in ${mrvTime}ms: NDVI ${mrv.metrics.ndviScore}, CO2e: ${mrv.metrics.co2TonsTotal} Tons`);

  // Test 3: IPFS Metadata Building & Pinning
  console.log('\n3️⃣ Testing IPFS Metadata Pinning...');
  const metadata = buildCarbonCreditMetadata({
    plot: plots.rows[0],
    report: {
      ndvi_score: mrv.metrics.ndviScore,
      canopy_cover_pct: mrv.metrics.canopyCoverPct,
      agb_mg_per_ha: mrv.metrics.agbMgPerHa,
      bgb_mg_per_ha: mrv.metrics.bgbMgPerHa,
      soc_mg_per_ha: mrv.metrics.socMgPerHa,
      co2_tons_total: mrv.metrics.co2TonsTotal,
      carbon_kg_total: mrv.metrics.carbonKgTotal,
    },
    farmerWallet: '0x71C83D431a89c9d4b009FE543477F5B648834465',
    priceMatic: 0.25,
  });
  const pin = await pinMetadataToIPFS(metadata);
  console.log(`✅ IPFS Pinning: ${pin.ipfsUri}`);

  console.log('\n🎉 ALL BACKEND & MRV VERIFICATIONS PASSED!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
