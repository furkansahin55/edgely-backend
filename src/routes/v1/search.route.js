const express = require('express');
const { searchController } = require('../../controllers');

const router = express.Router();

router.get('/search/collections', searchController.getCollections);

module.exports = router;
