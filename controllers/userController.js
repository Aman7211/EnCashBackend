const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const QRCode = require("../models/QRCode");
const User = require("../models/User");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOtp();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    const user = await User.findOne({ email });
    res.json({ isNewUser: !user });
  } catch (error) {
    console.log("Error while Sending the otp");
    console.log("Error in sending otp ", error);
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: "Invalid OTP" });

  const user = await User.findOne({ email });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, isNewUser: !user });
};

exports.saveUserInfo = async (req, res) => {
  try {
    const { name, email, phone, address, city, zipCode, dateOfBirth, occupation } = req.body;

    console.log("Received Payload:", req.body);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      city,
      zipCode,
      dateOfBirth,
      occupation,
    });

    res.status(201).json({
      success: true,
      message: "User info saved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error saving user info:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  res.json(user);
};

exports.redeemQrCode = async (req, res) => {
  const { code } = req.body;
  const qr = await QRCode.findOne({ code });

  if (!qr) return res.status(404).json({ message: "Invalid QR code" });
  if (qr.isUsed)
    return res.status(400).json({ message: "QR code already used" });

  // Credit user's wallet
  const user = await User.findOne({ email: req.user.email });
  user.wallet += qr.amount;
  await user.save();

  // Mark QR as used
  qr.isUsed = true;
  qr.usedBy = req.user.email;
  await qr.save();

  res.json({ message: "QR code redeemed", wallet: user.wallet });
};
