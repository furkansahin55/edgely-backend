const express = require('express');
const trendingController = require('../../controllers/trending.controller');
const validate = require('../../middlewares/validate');
const { trendingTable } = require('../../validations/trending.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/:timeFrame', auth('trending'), validate(trendingTable), trendingController.getTrendingTable);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Trending collections
 *   description: Trending collections
 */

/**
 * @swagger
 * /trending/{timeframe}:
 *   get:
 *     summary: Get trending table for {timeframe}
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
