const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const QRCode = require('../models/QRCode');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};

exports.registerAdmin = async (req, res) =>  {
  const { email, password } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: 'Admin created' });
};

exports.deleteQRCodeByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const qr = await QRCode.findOne({ code });
    if (!qr) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    await qr.deleteOne();

    res.status(200).json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    console.error('Delete by code error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Generate new QR code
exports.generateQrCode = async (req, res) => {
  const { amount } = req.body;
  const code = uuidv4(); // or use custom format

  const qr = await QRCode.create({ code, amount });
  res.json({ code, amount });
};

// Get all QR codes
exports.getAllQrCodes = async (req, res) => {
  const qrs = await QRCode.find();
  res.json(qrs);
};

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Update user info or wallet
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, wallet } = req.body;

  await User.findByIdAndUpdate(id, { name, wallet });
  res.json({ message: 'User updated' });
};
