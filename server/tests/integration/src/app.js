const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: config.maxRequestSize || '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs || 15 * 60 * 1000, // 15 minutes
  max: config.rateLimitMax || 100
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Export both app and config
module.exports = {
  app,
  config
};
