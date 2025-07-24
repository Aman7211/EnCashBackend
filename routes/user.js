import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/redeem', authMiddleware, async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code });

  if (!coupon || coupon.used) return res.status(400).json({ message: 'Invalid or used code' });

  coupon.used = true;
  coupon.usedByUserId = req.user._id;
  coupon.usedAt = new Date();
  await coupon.save();

  req.user.walletBalance += coupon.amount;
  req.user.transactions.push({ amount: coupon.amount, couponCode: code, date: new Date() });
  await req.user.save();

  res.json({ newBalance: req.user.walletBalance });
});

router.get('/transactions', authMiddleware, async (req, res) => {
  res.json(req.user.transactions);
});

export default router;
