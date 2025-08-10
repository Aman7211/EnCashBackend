const express = require('express');
const cors = require('cors');
const database = require('./config/database')
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const port = process.env.PORT || 3000;
app.use(express.json());
database.connectDB();

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API Server Running...');
});
app.listen(8000, () => console.log(`Server running on port ${port}`));
