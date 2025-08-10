const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  amount: Number,
  isUsed: { type: Boolean, default: false },
  usedBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
