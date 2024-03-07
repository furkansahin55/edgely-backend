const express = require('express');
const trendingController = require('../../controllers/trending.controller');
const validate = require('../../middlewares/validate');
const { trendingTable } = require('../../validations/trending.validation');

const router = express.Router();

router.get('/trending', validate(trendingTable), trendingController.getTrendingTable);

router.get('/liquidity-events', validate(trendingTable), trendingController.getTrendingTable);

router.get('/new', validate(trendingTable), trendingController.getTrendingTable);

router.get('/info/:address', validate(trendingTable), trendingController.getTrendingTable);

router.get('/price/:address', validate(trendingTable), trendingController.getTrendingTable);

router.get('/transactions/:address', validate(trendingTable), trendingController.getTrendingTable);

router.get('/traders/:address', validate(trendingTable), trendingController.getTrendingTable);

router.get('/balance/:address', validate(trendingTable), trendingController.getTrendingTable);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Pools
 *   description: Management of pool data
 */

/**
 * @swagger
 * /pools/trending:
 *   get:
 *     summary: Get trending pairs
 *     tags: [Pools]
 *     description: Retrieve trending pairs with various metrics. Supports filtering and ordering by the backend.
 *     parameters:
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order by column name
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter by column values
 *     responses:
 *       200:
 *         description: An array of trending pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pool_name:
 *                     type: string
 *                   exchange_name:
 *                     type: string
 *                   tx_count:
 *                     type: integer
 *                   traders_count:
 *                     type: integer
 *                   volume:
 *                     type: number
 *                   price:
 *                     type: number
 *                   price_change_pct:
 *                     type: number
 *                   liquidity:
 *                     type: number
 *                   fdv:
 *                     type: number
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /pools/liquidity-events:
 *   get:
 *     summary: Get liquidity events feed
 *     tags: [Pools]
 *     description: Retrieve a feed of liquidity events.
 *     responses:
 *       200:
 *         description: An array of liquidity events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                   exchange_name:
 *                     type: string
 *                   from_address:
 *                     type: string
 *                   base_token:
 *                     type: string
 *                   quote_token:
 *                     type: string
 *                   amount_in_usd:
 *                     type: number
 *                   price_in_usd:
 *                     type: number
 *                   base_token_amount:
 *                     type: number
 *                   quote_token_amount:
 *                     type: number
 *                   tx:
 *                     type: string
 */

/**
 * @swagger
 * /pools/new:
 *   get:
 *     summary: Get feed for new pairs
 *     tags: [Pools]
 *     description: Retrieve a feed of new pairs
 *     responses:
 *       200:
 *         description: An array of new pair feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pair_name:
 *                     type: string
 *                   pair_address:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   base_token:
 *                     type: string
 *                   quote_token:
 *                     type: string
 *                   initial_quote_token_amount:
 *                     type: number
 *                   initial_pool_timestamp:
 *                     type: string
 *                     format: date-time
 *                   current_quote_token_amount:
 *                     type: number
 *                   total_supply:
 *                     type: number
 */

/**
 * @swagger
 * /pools/info/{address}:
 *   get:
 *     summary: Get token analytics info
 *     tags: [Pools]
 *     description: Retrieve analytics and information for a specific token.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The token's address
 *     responses:
 *       200:
 *         description: Token analytics information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pair_address:
 *                   type: string
 *                 total_supply:
 *                   type: number
 *                 base_token:
 *                   type: string
 *                 quote_token:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 price:
 *                   type: number
 *                 price_in_usd:
 *                   type: number
 *                 liquidity:
 *                   type: number
 *                 fdv:
 *                   type: number
 *                 price_change_pct:
 *                   type: number
 */

/**
 * @swagger
 * /pools/price/{address}:
 *   get:
 *     summary: Get price chart data for a token
 *     tags: [Pools]
 *     description: Retrieve price chart data for a specific token.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The token's address
 *     responses:
 *       200:
 *         description: Price chart data
 */

/**
 * @swagger
 * /pools/transactions/{address}:
 *   get:
 *     summary: Get transactions for a token
 *     tags: [Pools]
 *     description: Retrieve a list of transactions for a specific token. Filters are applied backend side.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The token's address
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                   price_in_usd:
 *                     type: number
 *                   base_token_amount:
 *                     type: number
 *                   quote_token_amount:
 *                     type: number
 *                   value_in_usd:
 *                     type: number
 *                   address:
 *                     type: string
 */

/**
 * @swagger
 * /pools/traders/{address}:
 *   get:
 *     summary: Get traders data for a token
 *     tags: [Pools]
 *     description: Retrieve a list of traders for a specific token, with backend side ordering and infinite scroll.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The token's address
 *     responses:
 *       200:
 *         description: A list of traders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   wallet_address:
 *                     type: string
 *                   bought:
 *                     type: number
 *                   sold:
 *                     type: number
 *                   pnl:
 *                     type: number
 */

/**
 * @swagger
 * /pools/balance/{address}:
 *   get:
 *     summary: Get balance data for a token
 *     tags: [Pools]
 *     description: Retrieve balance data for a specific token, including received, sent, and change percentage.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The token's address
 *     responses:
 *       200:
 *         description: Balance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                 received:
 *                   type: number
 *                 sent:
 *                   type: number
 *                 change_pct:
 *                   type: number
 */
