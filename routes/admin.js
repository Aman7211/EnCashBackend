import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

router.post('/coupon', authMiddleware, adminMiddleware, async (req, res) => {
  const { amount } = req.body;
  const code = 'QR-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

  const coupon = new Coupon({
    code,
    amount,
    createdByAdminId: req.user._id
  });

  await coupon.save();
  res.json(coupon);
});

router.get('/coupons', authMiddleware, adminMiddleware, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

export default router;
