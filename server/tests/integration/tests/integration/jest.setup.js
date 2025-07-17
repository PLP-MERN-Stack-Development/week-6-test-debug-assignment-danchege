// Jest setup file to ensure TextEncoder is available globally
const { TextEncoder } = require('util');

global.TextEncoder = TextEncoder;

// Load environment variables
global.dotenv = require('dotenv');
global.path = require('path');

global.dotenv.config({ path: global.path.join(__dirname, '.env.test') });
