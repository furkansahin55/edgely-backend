const express = require('express');
const collectionController = require('../../controllers/collection.controller');
const validate = require('../../middlewares/validate');
const {
  addressValidation,
  vpsValidation,
  feedValidation,
  transactionsValidation,
  searchValidation,
  blockNumberValidation,
} = require('../../validations/collection.validation');

const router = express.Router();

router.get('/info/:address', validate(addressValidation), collectionController.getCollectionInfo);

router.get('/24h/:address', validate(addressValidation), collectionController.get24hInfo);

router.get('/vps/:address', validate(vpsValidation), collectionController.getVpsGraph);

router.get('/txs/:address', validate(transactionsValidation), collectionController.getTransactions);

router.get('/feed/:address', validate(feedValidation), collectionController.getFeeds);

router.get('/mints/chart/:address', validate(addressValidation), collectionController.getMintsChart);

router.get('/mints/table/:address', validate(addressValidation), collectionController.getMintsTable);

router.get('/holders/:address', validate(addressValidation), collectionController.getHolders);

router.get('/holders/chart/count/:address', validate(addressValidation), collectionController.getHoldersChartByCount);

router.get('/holders/chart/days/:address', validate(addressValidation), collectionController.getHoldersChartByDays);

router.get('/relations/collection/:address', validate(addressValidation), collectionController.getRelationsWithCollection);

router.get('/holders/actions/:address', validate(addressValidation), collectionController.getHoldersActions);

router.get('/search', validate(searchValidation), collectionController.searchCollections);

router.get('/block-number', validate(blockNumberValidation), collectionController.getBlockNumber);

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
