const parse = require("../src/parser.js").parse;

describe('Parser Precedence and Associativity Tests', () => {
  describe('Integer Operations', () => {
    test('should handle multiplication and division before addition and subtraction', () => {
      expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
      expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
      expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
      expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
    });

    test('should handle exponentiation with highest precedence', () => {
      expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
      expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
      expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
    });

    test('should handle right associativity for exponentiation', () => {
      expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
      expect(parse("3 ** 2 ** 2")).toBe(81);  // 3 ** (2 ** 2) = 3 ** 4 = 81
    });

    test('should handle mixed operations with correct precedence', () => {
      expect(parse("1 + 2 * 3 - 4")).toBe(3);   // 1 + (2 * 3) - 4 = 3
      expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
      expect(parse("10 - 3 * 2 + 1")).toBe(5);  // 10 - (3 * 2) + 1 = 5
    });

    test('should handle expressions with exponentiation precedence', () => {
      expect(parse("2 ** 3 + 1")).toBe(9);      // (2 ** 3) + 1 = 9
      expect(parse("3 + 2 ** 4")).toBe(19);     // 3 + (2 ** 4) = 19
      expect(parse("2 * 3 ** 2 + 1")).toBe(19); // 2 * (3 ** 2) + 1 = 19
    });

    test('should handle various realistic calculations with correct precedence', () => {
      expect(parse("1 + 2 * 3")).toBe(7);       // 1 + (2 * 3) = 7
      expect(parse("6 / 2 + 4")).toBe(7);       // (6 / 2) + 4 = 7
      expect(parse("2 ** 2 + 1")).toBe(5);      // (2 ** 2) + 1 = 5
      expect(parse("10 / 2 / 5")).toBe(1);      // (10 / 2) / 5 = 1
      expect(parse("100 - 50 + 25")).toBe(75);  // (100 - 50) + 25 = 75
      expect(parse("2 * 3 + 4 * 5")).toBe(26);  // (2 * 3) + (4 * 5) = 26
    });
  });

  describe('Floating Point Operations', () => {
    test('should handle float multiplication and division before addition and subtraction', () => {
      expect(parse("2.5 + 3.0 * 4.2")).toBeCloseTo(15.1); // 2.5 + (3.0 * 4.2) = 15.1
      expect(parse("10.5 - 6.4 / 2.0")).toBeCloseTo(7.3); // 10.5 - (6.4 / 2.0) = 7.3
      expect(parse("0.5 * 2.0 + 3.1")).toBeCloseTo(4.1);  // (0.5 * 2.0) + 3.1 = 4.1
      expect(parse("20.0 / 4.0 - 1.5")).toBeCloseTo(3.5); // (20.0 / 4.0) - 1.5 = 3.5
    });

    test('should handle float exponentiation with highest precedence', () => {
      expect(parse("1.5 + 2.0 ** 3.0")).toBeCloseTo(9.5);  // 1.5 + (2.0 ** 3.0) = 9.5
      expect(parse("0.5 * 4.0 ** 2.0")).toBeCloseTo(8.0);  // 0.5 * (4.0 ** 2.0) = 8.0
      expect(parse("10.0 - 3.0 ** 2.0")).toBeCloseTo(1.0); // 10.0 - (3.0 ** 2.0) = 1.0
    });

    test('should handle right associativity for float exponentiation', () => {
      expect(parse("2.0 ** 2.0 ** 3.0")).toBe(256);        // 2.0 ** (2.0 ** 3.0) = 2.0 ** 8.0 = 256
      expect(parse("4.0 ** 4.0 ** 0.5")).toBeCloseTo(16);  // 4.0 ** (4.0 ** 0.5) = 4.0 ** 2.0 = 16
    });

    test('should handle mixed float operations with correct precedence', () => {
      expect(parse("1.2 + 2.4 * 0.5 - 0.4")).toBeCloseTo(2.0);   // 1.2 + (2.4 * 0.5) - 0.4 = 2.0
      expect(parse("15.0 / 3.0 + 2.5 * 4.0")).toBeCloseTo(15.0); // (15.0 / 3.0) + (2.5 * 4.0) = 15.0
      expect(parse("10.5 - 2.5 * 2.0 + 0.5")).toBeCloseTo(6.0);  // 10.5 - (2.5 * 2.0) + 0.5 = 6.0
    });

    test('should handle float expressions with exponentiation precedence', () => {
      expect(parse("2.0 ** 3.0 + 0.5")).toBeCloseTo(8.5);        // (2.0 ** 3.0) + 0.5 = 8.5
      expect(parse("0.2 + 2.0 ** 4.0")).toBeCloseTo(16.2);       // 0.2 + (2.0 ** 4.0) = 16.2
      expect(parse("2.5 * 2.0 ** 2.0 + 1.0")).toBeCloseTo(11.0); // 2.5 * (2.0 ** 2.0) + 1.0 = 11.0
    });

    test('should handle various realistic float calculations with correct precedence', () => {
      expect(parse("1.5 + 2.5 * 3.0")).toBeCloseTo(9.0);          // 1.5 + (2.5 * 3.0) = 9.0
      expect(parse("7.5 / 2.5 / 1.5")).toBeCloseTo(2.0);          // (7.5 / 2.5) / 1.5 = 2.0
      expect(parse("100.0 - 50.5 + 25.5")).toBeCloseTo(75.0);     // (100.0 - 50.5) + 25.5 = 75.0
      expect(parse("0.5 * 10.0 + 0.2 * 50.0")).toBeCloseTo(15.0); // (0.5 * 10.0) + (0.2 * 50.0) = 15.0
    });
  });

  describe('Parentheses Operations', () => {
    test('should handle basic parentheses to override precedence', () => {
      expect(parse("(2 + 3) * 4")).toBe(20);   // (2 + 3) * 4 = 5 * 4 = 20
      expect(parse("10 / (2 + 3)")).toBe(2);   // 10 / (2 + 3) = 10 / 5 = 2
      expect(parse("(10 - 2) ** 2")).toBe(64); // (10 - 2) ** 2 = 8 ** 2 = 64
    });

    test('should handle nested parentheses', () => {
      expect(parse("2 * (3 + (4 / 2))")).toBe(10);   // 2 * (3 + 2) = 2 * 5 = 10
      expect(parse("((2 + 3) * 2) ** 2")).toBe(100); // (5 * 2) ** 2 = 10 ** 2 = 100
    });

    test('should handle complex expressions with parentheses and floats', () => {
      expect(parse("(1.5 + 0.5) * (2.0 + 3.0)")).toBeCloseTo(10.0); // 2.0 * 5.0 = 10.0
      expect(parse("2.0 ** (1.0 + 2.0)")).toBeCloseTo(8.0);         // 2.0 ** 3.0 = 8.0
    });

    test('should handle various realistic calculations with parentheses', () => {
      expect(parse("100 / (10 + 10) * 2")).toBe(10); // (100 / 20) * 2 = 5 * 2 = 10
      expect(parse("(5 + 5) ** (1 + 1)")).toBe(100); // 10 ** 2 = 100
    });

    test('should throw incorrect parentheses', () => {
      expect(() => parse("(")).toThrow();
      expect(() => parse("43)")).toThrow();
    });
  });

  describe('Factorial tests', () => {
    test('should handle normal factorial', () => {
      expect(parse("0!")).toBe(1);
      expect(parse("1!")).toBe(1);
      expect(parse("2!")).toBe(2);
      expect(parse("3!")).toBe(6);
      expect(parse("4!")).toBe(24);
      expect(parse("5!")).toBe(120);
    });

    test('should handle normal factorial', () => {
      expect(parse("(2 * 3)!")).toBe(720);
    });

    test('should throw on empty factorial', () => {
      expect(() => parse("!")).toThrow();
    });
  });
});