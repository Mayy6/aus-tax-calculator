export function calculateAusTaxableIncome(salary: number): number {
  // Defensive: treat non-finite or negative as zero
  if (!isFinite(salary) || salary <= 0) return 0

  if (salary <= 18200) return 0
  if (salary <= 45000) return (salary - 18200) * 0.19
  if (salary <= 120000) return 5092 + (salary - 45000) * 0.325
  if (salary <= 180000) return 29467 + (salary - 120000) * 0.37
  return 51667 + (salary - 180000) * 0.45
}

export default calculateAusTaxableIncome
