import { useState } from 'react'
import useBudgets from '../hooks/useBudgets'

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other']

const formatCurrency = (amount) => `$${(amount / 100).toFixed(2)}`

function Budgets() {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [form, setForm] = useState({ category: 'Food', amount: '' })
    const [showModal, setShowModal] = useState(false)

    const { budgetStatus, loading, setBudgetStatus } = useBudgets(month, year)
    const token = localStorage.getItem('token')

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: form.category,
                    amount: Math.round(parseFloat(form.amount) * 100),
                    month,
                    year
                })
            })

            await res.json()

            // Refresh budget status
            const statusRes = await fetch(`http://localhost:5000/api/budgets/status?month=${month}&year=${year}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const statusData = await statusRes.json()
            setBudgetStatus(statusData)

            setShowModal(false)
            setForm({ category: 'Food', amount: '' })
        } catch (error) {
            console.error('Error creating budget:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Budgets</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Set Budget
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4">
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* Budget Cards */}
                {loading ? (
                    <p className="text-center text-gray-400 py-10">Loading...</p>
                ) : budgetStatus.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-10 text-center">
                        <p className="text-gray-400 mb-2">No budgets set for this month</p>
                        <p className="text-sm text-gray-300">Click "Set Budget" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budgetStatus.map((budget) => (
                            <div key={budget.category} className="bg-white rounded-xl shadow p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-gray-700 text-lg">{budget.category}</h3>
                                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${budget.percentage > 100 ? 'bg-red-100 text-red-600' :
                                            budget.percentage > 75 ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-green-100 text-green-600'
                                        }`}>
                                        {budget.percentage}% used
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${budget.percentage > 100 ? 'bg-red-500' :
                                                budget.percentage > 75 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Spent: <span className="font-medium text-gray-700">{formatCurrency(budget.spent)}</span></span>
                                    <span>Limit: <span className="font-medium text-gray-700">{formatCurrency(budget.limit)}</span></span>
                                    <span>Left: <span className={`font-medium ${budget.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(budget.remaining)}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Set Budget Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Set Budget</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit ($)</label>
                                <input
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Budgets