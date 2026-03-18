import { describe, it, expect } from 'vitest'
import calculateAusTaxableIncome from '../lib/tax'

describe('calculateAusTaxableIncome', () => {
  it('returns 0 for income below or equal to 18200', () => {
    expect(calculateAusTaxableIncome(0)).toBe(0)
    expect(calculateAusTaxableIncome(18200)).toBe(0)
  })

  it('calculates correct tax for middle bracket', () => {
    // 30,000 => (30,000 - 18,200) * 0.19
    expect(calculateAusTaxableIncome(30000)).toBeCloseTo((30000 - 18200) * 0.19)
  })

  it('calculates correct tax for higher brackets', () => {
    expect(calculateAusTaxableIncome(60000)).toBeCloseTo(5092 + (60000 - 45000) * 0.325)
    expect(calculateAusTaxableIncome(150000)).toBeCloseTo(29467 + (150000 - 120000) * 0.37)
    expect(calculateAusTaxableIncome(250000)).toBeCloseTo(51667 + (250000 - 180000) * 0.45)
  })

  it('defensive: handles non-finite and negative inputs', () => {
    expect(calculateAusTaxableIncome(NaN)).toBe(0)
    expect(calculateAusTaxableIncome(-5000)).toBe(0)
  })
})
