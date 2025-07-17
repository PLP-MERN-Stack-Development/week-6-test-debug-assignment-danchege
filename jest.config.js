// jest.config.js - Root Jest configuration file

module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
  projects: [
    // Server-side tests configuration
    {
      displayName: 'server',
      setupFiles: ['<rootDir>/server/tests/integration/jest.setup.js'],
      testMatch: ['**/server/tests/unit/**/*.test.js', '**/server/tests/integration/**/*.test.js'],
      testEnvironment: 'node',
      moduleDirectories: ['node_modules', 'server/src'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/server/src/$1',
      },
      transform: {
        '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }],
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(@babel|mongodb|mongoose|mongodb-memory-server)/)',
      ],
      globals: {
        'NODE_ENV': 'test'
      },
      coverageDirectory: '<rootDir>/coverage/server',
      collectCoverageFrom: [
        'server/src/**/*.js',
        '!server/src/config/**',
        '!**/node_modules/**',
      ],
    },
    
    // Client-side tests configuration
    {
      displayName: 'client',
      testMatch: ['**/client/src/tests/**/*.test.js'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/client/src/tests/setup.js'],
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/client/src/tests/__mocks__/fileMock.js',
      },
      coverageDirectory: '<rootDir>/coverage/client',
      collectCoverageFrom: [
        'client/src/**/*.{js,jsx}',
        '!client/src/index.js',
        '!**/node_modules/**',
      ],
    },
  ],
  
  // Global configuration
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
}; 