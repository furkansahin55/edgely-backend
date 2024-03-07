const express = require('express');
const alertsController = require('../../controllers/alerts.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createAlert, updateAlert, deleteAlert } = require('../../validations/alerts.validation');

const router = express.Router();

router.get('/', auth('alerts'), alertsController.getAlertsByUser);

router.post('/', auth('alerts'), validate(createAlert), alertsController.createAlert);

router.delete('/:id', auth('alerts'), validate(deleteAlert), alertsController.deleteAlert);

router.put('/', auth('alerts'), validate(updateAlert), alertsController.updateAlert);

router.get('/types', auth('alerts'), alertsController.getAlertTypes);

router.get('/deliver_channel_types', auth('alerts'), alertsController.getDeliveryChannelTypes);

module.exports = router;
