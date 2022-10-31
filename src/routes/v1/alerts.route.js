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

/**
 * @swagger
 * tags:
 *  name: Alerts
 * description: Alerts CRUD
 * */

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get alerts for logged in user
 *     tags: [Alerts]
 *     requestBody:
 *       required: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nonce:
 *                   type: string
 *               example:
 *                 nonce: 'I want to login with my wallet. Nonce: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoxNjYxMTcwMjM3ODM5LCJpYXQiOjE2NjExNzAyMzcsImV4cCI6MTY2MTE3MDgzN30.b_PwUJoKOyOoagfVeRIaiiFSADd0N177N9w2Fbzjwjw'
 * */
