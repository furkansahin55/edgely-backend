const express = require('express');
const searchController = require('../../controllers/search.controller');
const { searchValidation } = require('../../validations/search.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.get('/collections/:text', validate(searchValidation), searchController.searchCollections);

module.exports = router;
