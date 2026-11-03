const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Marketplace statistics overview
router.get('/stats', marketplaceController.getMarketplaceStats);

// Plot NFT lifecycle actions
router.post('/plots/:id/prepare-mint', marketplaceController.prepareMint);
router.post('/plots/:id/record-mint', marketplaceController.recordMint);
router.post('/plots/:id/record-purchase', marketplaceController.recordPurchase);
router.post('/plots/:id/retire', marketplaceController.retireCredit);

module.exports = router;
