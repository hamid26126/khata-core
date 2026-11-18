import { describe, expect, it } from 'vitest';
import { DEFAULT_CURRENCY, DEFAULT_MINOR_UNITS_PER_MAJOR } from './index.js';

describe('ledger defaults', () => {
  it('defaults to Pakistani rupees', () => {
    expect(DEFAULT_CURRENCY).toBe('PKR');
  });

  it('uses an integer number of paisa per rupee', () => {
    expect(Number.isInteger(DEFAULT_MINOR_UNITS_PER_MAJOR)).toBe(true);
    expect(DEFAULT_MINOR_UNITS_PER_MAJOR).toBe(100);
  });
});
