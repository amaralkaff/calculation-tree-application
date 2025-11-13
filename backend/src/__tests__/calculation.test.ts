import { Calculation } from '../models/Calculation';
import { OperationType } from '../types';

describe('Calculation Model', () => {
  describe('calculateResult', () => {
    it('should correctly add two numbers', () => {
      const result = Calculation.calculateResult(10, OperationType.ADD, 5);
      expect(result).toBe(15);
    });

    it('should correctly subtract two numbers', () => {
      const result = Calculation.calculateResult(10, OperationType.SUBTRACT, 5);
      expect(result).toBe(5);
    });

    it('should correctly multiply two numbers', () => {
      const result = Calculation.calculateResult(10, OperationType.MULTIPLY, 5);
      expect(result).toBe(50);
    });

    it('should correctly divide two numbers', () => {
      const result = Calculation.calculateResult(10, OperationType.DIVIDE, 5);
      expect(result).toBe(2);
    });

    it('should throw error on division by zero', () => {
      expect(() => {
        Calculation.calculateResult(10, OperationType.DIVIDE, 0);
      }).toThrow('Division by zero is not allowed');
    });

    it('should handle decimal numbers', () => {
      const result = Calculation.calculateResult(10.5, OperationType.ADD, 5.3);
      expect(result).toBeCloseTo(15.8);
    });

    it('should handle negative numbers', () => {
      const result = Calculation.calculateResult(-10, OperationType.ADD, 5);
      expect(result).toBe(-5);
    });
  });
});
