const mongoose = require('mongoose');

// Drop existing test database
async function dropDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/test_db');
    await mongoose.connection.db.dropDatabase();
    console.log('Test database dropped successfully');
  } catch (error) {
    console.error('Error dropping test database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Create test data
async function createTestData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/test_db');
    
    // Add your test data creation logic here
    console.log('Test data created successfully');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Main execution
async function setupTestDatabase() {
  await dropDatabase();
  await createTestData();
  console.log('Test database setup completed');
}

setupTestDatabase();
