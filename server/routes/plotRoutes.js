const express = require('express');
const router = express.Router();
const plotController = require('../controllers/plotController');
const { authenticateToken } = require('../middleware/auth');

// Optional auth for listing (evaluators can browse without being logged in)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.split(' ')[1]) {
    return authenticateToken(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, plotController.listPlots);
router.get('/:id', optionalAuth, plotController.getPlotById);
router.post('/', optionalAuth, plotController.createPlot);

module.exports = router;
