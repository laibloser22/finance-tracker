import { useState } from 'react'
import useTransactions from '../hooks/useTransactions'

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Salary', 'Freelance', 'Other']

const formatCurrency = (amount) => `$${(amount / 100).toFixed(2)}`

function Transactions() {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({
        amount: '',
        type: 'EXPENSE',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
    })

    const { transactions, loading, setTransactions } = useTransactions(month, year)
    const token = localStorage.getItem('token')

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    amount: Math.round(parseFloat(form.amount) * 100)
                })
            })
            const data = await res.json()
            setTransactions(prev => [data, ...prev])
            setShowModal(false)
            setForm({ amount: '', type: 'EXPENSE', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] })
        } catch (error) {
            console.error('Error creating transaction:', error)
        }
    }

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setTransactions(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            console.error('Error deleting transaction:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Transaction
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

                {/* Transactions List */}
                <div className="bg-white rounded-xl shadow">
                    {loading ? (
                        <p className="text-center text-gray-400 py-10">Loading...</p>
                    ) : transactions.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">No transactions found</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-medium text-gray-700">{t.description || t.category}</p>
                                        <p className="text-sm text-gray-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className={`font-bold ${t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </p>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-red-400 hover:text-red-600 text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Add Transaction</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Transactions