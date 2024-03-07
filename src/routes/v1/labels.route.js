const express = require('express');
const labelsController = require('../../controllers/labels.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { labelsUpsert, getAdresses } = require('../../validations/labels.validation');

const router = express.Router();

router.get('/', auth('labels'), labelsController.getLabels);

router.post('/', auth('labels'), validate(labelsUpsert), labelsController.upsertLabels);

router.get('/adresses', auth('labels'), validate(getAdresses), labelsController.getAdresses);

module.exports = router;
