require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

// Import route files
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Attendance and Lunch Management System API');
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;