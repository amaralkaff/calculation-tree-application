import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle calculations correctly', () => {
    const add = (a: number, b: number) => a + b;
    const subtract = (a: number, b: number) => a - b;
    const multiply = (a: number, b: number) => a * b;
    const divide = (a: number, b: number) => a / b;

    expect(add(5, 3)).toBe(8);
    expect(subtract(5, 3)).toBe(2);
    expect(multiply(5, 3)).toBe(15);
    expect(divide(6, 3)).toBe(2);
  });
});
