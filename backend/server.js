require('dotenv').config();
console.log('Starting bug tracker server...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bugRoutes = require('./routes/bugRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('MongoDB connection state:', mongoose.connection.readyState);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000); // Retry connection
  }
};

connectDB();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const db = mongoose.connection;
    const isConnected = db.readyState === 1;
    const dbState = {
      readyState: db.readyState,
      host: db.host,
      port: db.port
    };
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      dbConnected: isConnected,
      dbState
    });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// Routes
app.use('/api/bugs', bugRoutes);

// Handle all other routes
app.get('*', (req, res) => {
  console.log(`Received request for unknown route: ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Listening at http://localhost:${PORT}`);
});
