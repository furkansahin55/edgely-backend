const express = require('express');
const trendingController = require('../../controllers/trending.controller');
const validate = require('../../middlewares/validate');
const { trendingTable } = require('../../validations/trending.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/:timeFrame', validate(trendingTable), trendingController.getTrendingTable);

router.get('/labels/:timeFrame', auth('trending'), validate(trendingTable), trendingController.getTrendingLabelsTable);

module.exports = router;
