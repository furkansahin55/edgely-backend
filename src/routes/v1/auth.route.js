const express = require('express');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');

const router = express.Router();

router.get('/nonce', authController.getNonce);
router.post('/login', validate(authValidation.nonce), authController.verifyNonce);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/logout', validate(authValidation.logout), authController.logout);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Web3 Auth
 *   description: Web3 Authentication
 */

/**
 * @swagger
 * /auth/nonce:
 *   get:
 *     summary: Get a nonce to sign
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - signed
 *               - address
 *             properties:
 *               message:
 *                 type: string
 *               signed:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               message: 'I want to login with my wallet. Nonce: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoxNjYxMTcwMjM3ODM5LCJpYXQiOjE2NjExNzAyMzcsImV4cCI6MTY2MTE3MDgzN30.b_PwUJoKOyOoagfVeRIaiiFSADd0N177N9w2Fbzjwjw'
 *               signed: 'signed message'
 *               address: '0xb14b0F684de41092E1Dd6E351b60A9AD0c60360b'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Signature not valid or token expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Signature not valid or token expired
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
