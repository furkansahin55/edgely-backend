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
