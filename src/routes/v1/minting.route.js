const express = require('express');
const mintingController = require('../../controllers/minting.controller');
const validate = require('../../middlewares/validate');
const { mintingTable } = require('../../validations/minting.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/:timeFrame', validate(mintingTable), mintingController.getMintingTable);

router.get('/labels/:timeFrame', auth('minting'), validate(mintingTable), mintingController.getMintingLabelsTable);

module.exports = router;
