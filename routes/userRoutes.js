const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, saveUserInfo, redeemQrCode, getProfile } = require('../controllers/userController');
const { verifyUserToken } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/save-info', saveUserInfo);
router.post('/redeem', verifyUserToken, redeemQrCode);
router.get('/profile', verifyUserToken, getProfile);

module.exports = router;
