import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: Number,
  couponCode: String,
  date: Date
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  walletBalance: { type: Number, default: 0 },
  transactions: [transactionSchema]
});

export default mongoose.model('User', userSchema);
