const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String},
    phone: { type: String},
    address: { type: String},
    city: { type: String},
    zipCode: { type: String},
    dateOfBirth: { type: Date },
    occupation: { type: String},
    email: { type: String, unique: true },
    wallet: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
