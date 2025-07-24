import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  amount: Number,
  createdByAdminId: mongoose.ObjectId,
  createdAt: { type: Date, default: Date.now },
  used: { type: Boolean, default: false },
  usedByUserId: mongoose.ObjectId,
  usedAt: Date
});

export default mongoose.model('Coupon', couponSchema);
