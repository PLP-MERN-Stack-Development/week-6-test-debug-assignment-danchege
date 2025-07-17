const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.test in test directory
const envPath = path.join(__dirname, '../../tests/integration/.env.test');
dotenv.config({ path: envPath });

// Default configuration
const defaultConfig = {
  // Environment
  env: 'test',
  
  // Server
  port: 3000,
  
  // MongoDB
  mongoUri: 'mongodb://localhost:27017/mern-blog',
  testMongoUri: 'mongodb://localhost:27017/mern-blog-test',
  
  // JWT
  jwtSecret: 'your-secret-key-here',
  
  // Logging
  logLevel: 'info',
  
  // Request handling
  maxRequestSize: '50mb',
  
  // Rate limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100
};

// Load environment variables and merge with defaults
const config = {
  ...defaultConfig,
  ...Object.entries(defaultConfig).reduce((acc, [key, defaultValue]) => {
    const envValue = process.env[key.toUpperCase()];
    if (envValue !== undefined) {
      // Convert numbers and booleans from strings
      if (!isNaN(envValue)) {
        acc[key] = Number(envValue);
      } else if (envValue.toLowerCase() === 'true') {
        acc[key] = true;
      } else if (envValue.toLowerCase() === 'false') {
        acc[key] = false;
      } else {
        acc[key] = envValue;
      }
    }
    return acc;
  }, {})
};

module.exports = config;
