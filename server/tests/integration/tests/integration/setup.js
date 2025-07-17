// Polyfill for TextEncoder if not available
global.TextEncoder = require('util').TextEncoder;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs').promises;

// Ensure MongoDB temp directory exists
async function ensureMongoTempDir() {
  const tempDir = path.join(require('os').tmpdir(), 'mongodb-memory-server');
  try {
    await fs.access(tempDir);
  } catch (error) {
    await fs.mkdir(tempDir, { recursive: true });
  }
}

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '.env.test') });

// Load config after setting environment variables
const { config } = require('../../src/config/config');

// MongoDB Memory Server instance
let mongoServer;

// Create a test database connection
async function setupMongo() {
  try {
    // Ensure MongoDB temp directories exist
    await ensureMongoTempDir();
    
    // Create MongoDB Memory Server with default options
    mongoServer = await MongoMemoryServer.create();
    config.testMongoUri = mongoServer.getUri();
    
    // Connect to MongoDB with increased timeout
    await mongoose.connect(config.testMongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
      socketTimeoutMS: 30000
    });
    
    console.log('Connected to in-memory MongoDB');
  } catch (error) {
    console.error('Error setting up MongoDB Memory Server:', error);
    throw error;
  }
}

// Clean up after all tests
async function cleanupMongo() {
  if (!mongoServer) {
    console.warn('MongoDB server instance not found');
    return;
  }

  try {
    // Close all connections
    await mongoose.disconnect();
    // Stop the MongoDB server
    await mongoServer.stop();
    console.log('Disconnected from in-memory MongoDB');
  } catch (error) {
    console.error('Error cleaning up MongoDB Memory Server:', error);
    throw error;
  } finally {
    mongoServer = null; // Clear the instance reference
  }
}

// Clear all collections
async function clearCollections() {
  try {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      // Skip clearing system collections
      if (collectionName.startsWith('system.')) continue;
      await mongoose.connection.collection(collectionName).deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing collections:', error);
    throw error;
  }
}

// Drop all collections
async function dropCollections() {
  try {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      // Skip dropping system collections
      if (collectionName.startsWith('system.')) continue;
      const collection = mongoose.connection.collection(collectionName);
      await collection.drop();
    }
  } catch (error) {
    console.error('Error dropping collections:', error);
    throw error;
  }
}

// Create test data
async function createTestData() {
  try {
    const User = mongoose.model('User', require('../../src/models/User'));
    
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'admin'
      }
    ];

    await User.insertMany(testUsers);
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
}

module.exports = {
  setupMongo,
  cleanupMongo,
  clearCollections,
  dropCollections,
  createTestData
};
