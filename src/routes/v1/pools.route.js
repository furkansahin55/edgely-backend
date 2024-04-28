const express = require('express');
const poolsController = require('../../controllers/pools.controller');

const router = express.Router();

router.get('/trending', (req, res) => {
  // Sample response with fake data
  res.json([
    {
      pool_name: 'ETH/USDT',
      base_token_name: 'ETH',
      exchange_name: 'Uniswap',
      tx_count: 1000,
      traders_count: 500,
      volume: 200000.5,
      price: 3500.0,
      price_change_pct: 0.05,
      liquidity_in_usd: 5000000.0,
      fdv: 700000000.0,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      pool_name: 'ADA/USDT',
      base_token_name: 'ADA',
      exchange_name: 'Balancer',
      tx_count: 1458,
      traders_count: 225,
      volume: 280224.95,
      price: 5566.18,
      price_change_pct: 0.06,
      liquidity_in_usd: 6044837.67,
      fdv: 134239130.91,
      created_at: '2024-02-11T00:00:00Z',
    },
    {
      pool_name: 'ADA/USDT',
      base_token_name: 'ADA',
      exchange_name: 'Sushiswap',
      tx_count: 606,
      traders_count: 426,
      volume: 129644.66,
      price: 2382.44,
      price_change_pct: 0.03,
      liquidity_in_usd: 7933495.3,
      fdv: 774067812.2,
      created_at: '2024-04-23T00:00:00Z',
    },
    {
      pool_name: 'DOT/USDT',
      base_token_name: 'DOT',
      exchange_name: 'Uniswap',
      tx_count: 1238,
      traders_count: 693,
      volume: 299023.1,
      price: 4000.01,
      price_change_pct: -0.06,
      liquidity_in_usd: 1414584.63,
      fdv: 421076834.82,
      created_at: '2024-05-10T00:00:00Z',
    },
    {
      pool_name: 'BTC/USDT',
      base_token_name: 'BTC',
      exchange_name: 'Balancer',
      tx_count: 1394,
      traders_count: 359,
      volume: 133296.61,
      price: 2031.3,
      price_change_pct: 0.01,
      liquidity_in_usd: 1184178.9,
      fdv: 967376628.03,
      created_at: '2024-11-08T00:00:00Z',
    },
  ]);
});

router.get('/liquidity-events', poolsController.getLiquidityEvents);

router.get('/new', (req, res) => {
  res.json([
    {
      pair_name: 'ETH/DAI',
      pair_address: '0x456',
      created_at: '2024-01-03T00:00:00Z',
      base_token: 'ETH',
      quote_token: 'DAI',
      initial_quote_token_amount: 10000.0,
      initial_pool_timestamp: '2024-01-03T00:00:00Z',
      current_quote_token_amount: 12000.0,
      total_supply: 2000.0,
    },
  ]);
});

router.get('/info/:address', (req, res) => {
  const { address } = req.params;
  res.json({
    pair_address: address,
    total_supply: 100000.0,
    base_token: 'ETH',
    quote_token: 'USDT',
    created_at: '2024-01-04T00:00:00Z',
    price: 3500.0,
    price_in_usd: 3500.0,
    liquidity: 7000000.0,
    fdv: 350000000.0,
    price_change_pct: 0.07,
  });
});

router.get('/price/:address', (req, res) => {
  res.json({ message: `Price chart data for address ${req.params.address}` });
});

router.get('/transactions/:address', (req, res) => {
  const { address } = req.params;
  res.json([
    {
      date: '2024-01-05T10:00:00Z',
      type: 'Trade',
      price_in_usd: 3500.0,
      base_token_amount: 1.0,
      quote_token_amount: 3500.0,
      value_in_usd: 3500.0,
      address,
    },
  ]);
});

router.get('/traders/:address', (req, res) => {
  res.json([
    {
      wallet_address: '0x789',
      bought: 5000.0,
      sold: 3000.0,
      pnl: 2000.0,
    },
  ]);
});

router.get('/balance/:address', (req, res) => {
  res.json({
    balance: 1000.0,
    received: 500.0,
    sent: 200.0,
    change_pct: 0.6,
  });
});

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
 *                   base_token_name:
 *                    type: string
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
 *                   liquidity_in_usd:
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
 *                   pair_name:
 *                     type: string
 *                   pair_age:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                   exchange_name:
 *                     type: string
 *                   from_address:
 *                     type: string
 *                   amount_in_usd:
 *                     type: number
 *                   price_in_usd:
 *                     type: number
 *                   base_token_amount:
 *                     type: number
 *                   quote_token_amount:
 *                     type: number
 *                   liquidity_in_usd:
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
