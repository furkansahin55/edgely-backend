const express = require('express');
const searchController = require('../../controllers/search.controller');

const router = express.Router();

router.get('/collections/:text', searchController.searchCollections);

module.exports = router;
