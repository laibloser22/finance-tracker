import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useTransactions from '../hooks/useTransactions'
import useBudgets from '../hooks/useBudgets'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const formatCurrency = (amount) => {
    return `$${(amount / 100).toFixed(2)}`
}

function Dashboard() {
    const now = new Date()
    const [month] = useState(now.getMonth() + 1)
    const [year] = useState(now.getFullYear())

    const { transactions, summary, loading } = useTransactions(month, year)
    const { budgetStatus } = useBudgets(month, year)

    // Build pie chart data from expenses by category
    const pieData = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category)
            if (existing) existing.value += t.amount
            else acc.push({ name: t.category, value: t.amount })
            return acc
        }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Income</p>
                        <p className="text-3xl font-bold text-green-500">{formatCurrency(summary.income)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-500">{formatCurrency(summary.expenses)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-500 mb-1">Balance</p>
                        <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                            {formatCurrency(summary.balance)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h3>
                        {pieData.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">No expenses this month</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {pieData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Budget Status */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Budget Status</h3>
                        {budgetStatus.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">No budgets set this month</p>
                        ) : (
                            <div className="space-y-4">
                                {budgetStatus.map((budget) => (
                                    <div key={budget.category}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{budget.category}</span>
                                            <span className="text-gray-500">
                                                {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${budget.percentage > 100 ? 'bg-red-500' : budget.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{budget.percentage}% used</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
                    {transactions.length === 0 ? (
                        <p className="text-gray-400 text-center py-10">No transactions this month</p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.slice(0, 5).map((t) => (
                                <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-700">{t.description || t.category}</p>
                                        <p className="text-sm text-gray-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-bold ${t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard