const express = require('express');
const { waitlistController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { waitlistValidation } = require('../../validations');

const router = express.Router();

router.post('/', validate(waitlistValidation.waitlistCreate), waitlistController.create);

module.exports = router;
