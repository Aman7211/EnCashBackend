const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin,deleteQRCodeByCode, generateQrCode, getAllUsers, getAllQrCodes, updateUser } = require('../controllers/adminController');
const { verifyUserToken } = require('../middleware/authMiddleware');

// Auth
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Admin functions
router.post('/qrcode/generate', verifyUserToken, generateQrCode);
router.get('/qrcodes', verifyUserToken, getAllQrCodes);
router.get('/users', verifyUserToken, getAllUsers);
router.post('/user/:id/update', verifyUserToken, updateUser);
router.delete('/qrcode/code/:code', deleteQRCodeByCode);


module.exports = router;
