const { validateEmail, generateToken } = require('../../src/utils');

describe('Utility Functions', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag+sorting@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = generateToken({ userId: '123' });
      expect(typeof token).toBe('string');
      expect(token).toBeTruthy();
    });
  });
});
