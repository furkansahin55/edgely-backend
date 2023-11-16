const express = require('express');
const labelsController = require('../../controllers/labels.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { labelsUpsert, getAdresses } = require('../../validations/labels.validation');

const router = express.Router();

router.get('/', auth('labels'), labelsController.getLabels);

router.post('/', auth('labels'), validate(labelsUpsert), labelsController.upsertLabels);

router.post('/adresses', auth('labels'), validate(getAdresses), labelsController.getAdresses);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Labels
 *   description: Labels CRUD
 */

/**
 * @swagger
 * /labels:
 *   get:
 *     summary: Get labels for logged in user
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
