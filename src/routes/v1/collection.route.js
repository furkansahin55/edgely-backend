const express = require('express');
const collectionController = require('../../controllers/collection.controller');
const validate = require('../../middlewares/validate');
const { addressValidation, vpsValidation, feedValidation } = require('../../validations/collection.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/info/:address', auth('collection'), validate(addressValidation), collectionController.getCollectionInfo);

router.get('/24h/:address', auth('collection'), validate(addressValidation), collectionController.get24hMetrics);

router.get('/vps/:timeframe/:address', auth('collection'), validate(vpsValidation), collectionController.getVpsMetrics);

router.get('/txs/:address', auth('collection'), validate(addressValidation), collectionController.getTransactions);

router.get('/feed/:address', auth('collection'), validate(feedValidation), collectionController.getFeeds);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: collection analytics
 */

/**
 * @swagger
 * /info/{address}:
 *   get:
 *     summary: Get collection info for {address}
 *     tags: [Auth]
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
 *                  type: string
 *             example:
 *               nonce: 'I want to login with my wallet. Nonce: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoxNjYxMTcwMjM3ODM5LCJpYXQiOjE2NjExNzAyMzcsImV4cCI6MTY2MTE3MDgzN30.b_PwUJoKOyOoagfVeRIaiiFSADd0N177N9w2Fbzjwjw'
 */
