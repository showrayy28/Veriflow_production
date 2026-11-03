const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');

// Verification endpoint: triggers NASA Earth Observation Remote Sensing MRV
router.post('/plots/:id/verify-satellite', verifyController.verifyPlotSatellite);

module.exports = router;
