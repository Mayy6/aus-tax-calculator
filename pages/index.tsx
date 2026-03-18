import Head from 'next/head'
import { useState } from 'react'
import calculateAusTaxableIncome from '../lib/tax'

export default function Home() {
  const [salary, setSalary] = useState<number>(90000)
  const [superRate, setSuperRate] = useState<number>(11)
  const incomeTax = calculateAusTaxableIncome(salary)
  const medicareLevy = Math.max(0, salary * 0.02) // simplified 2%
  const takeHome = salary - incomeTax - medicareLevy
  const superContribution = salary * (superRate / 100)

  const fmt = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 })

  // percentages for visual bars (clamped 0-100)
  const taxPercent = Math.min(100, Math.max(0, (incomeTax / salary) * 100))
  const medicarePercent = Math.min(100, Math.max(0, (medicareLevy / salary) * 100))

  return (
    <div className="min-h-screen bg-app-bg">
      <Head>
        <title>AUS Tax Calculator</title>
      </Head>

      <header className="bg-gradient-to-r from-sky-700 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-6 bg-[url('/flag.png')] bg-contain bg-center rounded-sm" aria-hidden />
            <div>
              <h1 className="text-2xl font-bold">Australian Tax Calculator</h1>
              <div className="text-sm opacity-90">Calculate your income tax for the 2025-2026 tax year</div>
            </div>
          </div>
          <div className="text-sm opacity-90">Simple estimates • Not financial advice</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Income Details */}
        <section className="md:col-span-3 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-slate-700 mb-4">Income Details</h2>

          <label className="block mb-4">
            <div className="text-sm text-slate-600">Gross Annual Income ($)</div>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-2 block w-full rounded-md border border-gray-200 p-2 shadow-sm focus:ring-2 focus:ring-indigo-200"
            />
            <div className="text-xs text-gray-400 mt-1">Enter your gross annual income</div>
          </label>

          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-100">
            <div className="text-sm font-medium text-slate-700 mb-2">Tax Offsets & Options</div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="form-checkbox" />
              Senior Citizen Offset
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 mt-2">
              <input type="checkbox" className="form-checkbox" />
              Supporting Dependant Spouse
            </label>
          </div>

          <button
            onClick={(e) => e.preventDefault()}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white py-2 px-4 shadow hover:opacity-95"
          >
            Calculate Tax
          </button>
        </section>

        {/* Center: Results */}
        <section className="md:col-span-6 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-slate-700 mb-4">Tax Calculation Results</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-indigo-600 text-white">
              <div className="text-xs opacity-90">GROSS INCOME</div>
              <div className="mt-2 text-xl font-bold">{fmt.format(salary)}</div>
            </div>

            <div className="p-4 rounded-lg bg-white border border-gray-100">
              <div className="text-xs text-gray-500">INCOME TAX</div>
              <div className="mt-2 text-xl font-bold">{fmt.format(incomeTax)}</div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="text-xs text-green-700">TAX OFFSETS</div>
              <div className="mt-2 text-lg font-medium text-green-800">- $0.00</div>
            </div>

            <div className="p-4 rounded-lg bg-white border border-gray-100">
              <div className="text-xs text-gray-500">NET INCOME TAX</div>
              <div className="mt-2 text-lg font-medium">{fmt.format(incomeTax)}</div>
            </div>

            <div className="p-4 rounded-lg bg-white border border-gray-100">
              <div className="text-xs text-gray-500">MEDICARE LEVY (2%)</div>
              <div className="mt-2 text-lg font-medium">{fmt.format(medicareLevy)}</div>
            </div>

            <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
              <div className="text-xs text-rose-700">TOTAL TAX</div>
              <div className="mt-2 text-lg font-medium text-rose-700">{fmt.format(incomeTax + medicareLevy)}</div>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded p-4 border border-gray-100">
            <div className="text-sm text-gray-600">Tax Information</div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500">Effective Tax Rate:</div>
                <div className="font-semibold">{salary > 0 ? ((incomeTax / salary) * 100).toFixed(2) + '%' : '0.00%'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Tax Bracket:</div>
                <div className="font-semibold">{getBracketLabel(salary)}</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">Income Breakdown</div>
            <div className="mt-2 h-4 bg-gray-100 rounded overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${Math.max(0, ((takeHome) / salary) * 100)}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${Math.max(0, ((incomeTax + medicareLevy) / salary) * 100)}%` }} />
            </div>

            <div className="mt-4 text-center">
              <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded">Calculate Again</button>
            </div>
          </div>
        </section>

        {/* Right: Tax Info */}
        <aside className="md:col-span-3 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-700 mb-4">2025-2026 Tax Information</h3>
          <div className="text-sm text-gray-600">
            <div className="mb-3 font-medium">Tax Brackets</div>
            <ul className="space-y-2 mb-4">
              <li><span className="font-semibold">$0 - $18,200:</span> Tax-free threshold</li>
              <li><span className="font-semibold">$18,201 - $45,000:</span> 19%</li>
              <li><span className="font-semibold">$45,001 - $120,000:</span> 32.5%</li>
              <li><span className="font-semibold">$120,001 - $180,000:</span> 37%</li>
              <li><span className="font-semibold">$180,000+:</span> 45%</li>
            </ul>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-sm">
              <div className="font-semibold">Additional Information</div>
              <div className="mt-2">Medicare Levy: 2% of taxable income</div>
              <div>LITO: Up to $700 for lower income earners</div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="bg-slate-900 text-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-center">© 2025 Australian Tax Calculator | For educational purposes only</div>
      </footer>
    </div>
  )
}

function getBracketLabel(salary: number) {
  if (salary <= 18200) return 'Tax-free threshold'
  if (salary <= 45000) return 'Low income'
  if (salary <= 120000) return 'Middle income'
  if (salary <= 180000) return 'High income'
  return 'Very high income'
}
