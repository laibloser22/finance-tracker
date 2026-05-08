import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useTransactions from '../hooks/useTransactions'
import useBudgets from '../hooks/useBudgets'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const formatCurrency = (amount) => `$${(amount / 100).toFixed(2)}`

function SummaryCard({ label, value, color, glow, delay, icon }) {
    return (
        <div className={`animate-fade-up stagger-${delay}`} style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: `0 8px 32px ${glow}, 0 2px 8px rgba(0,0,0,0.04)`,
            transition: 'all 0.3s ease',
            cursor: 'default',
            opacity: 0,
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 20px 60px ${glow}, 0 4px 16px rgba(0,0,0,0.08)`
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `0 8px 32px ${glow}, 0 2px 8px rgba(0,0,0,0.04)`
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            </div>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                {value}
            </p>
        </div>
    )
}

function Dashboard() {
    const now = new Date()
    const [month] = useState(now.getMonth() + 1)
    const [year] = useState(now.getFullYear())

    const { transactions, summary, loading } = useTransactions(month, year)
    const { budgetStatus } = useBudgets(month, year)

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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        border: '3px solid rgba(99,102,241,0.2)',
                        borderTop: '3px solid #6366f1',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading your finances...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div className="animate-fade-up" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.25rem' }}>
                        Good {now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
                    </h2>
                    <p style={{ color: '#6b7280', fontWeight: 500 }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.75rem' }}>
                    <SummaryCard label="Total Income" value={formatCurrency(summary.income)} color="#10b981" glow="rgba(16,185,129,0.15)" delay={1} icon="💚" />
                    <SummaryCard label="Total Expenses" value={formatCurrency(summary.expenses)} color="#ef4444" glow="rgba(239,68,68,0.15)" delay={2} icon="🔴" />
                    <SummaryCard label="Balance" value={formatCurrency(summary.balance)} color={summary.balance >= 0 ? '#6366f1' : '#ef4444'} glow="rgba(99,102,241,0.15)" delay={3} icon="⚡" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>

                    {/* Pie Chart */}
                    <div className="animate-fade-up stagger-2" style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.1)',
                        opacity: 0,
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'inline-block' }} />
                            Spending by Category
                        </h3>
                        {pieData.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</p>
                                <p style={{ fontWeight: 500 }}>No expenses this month</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                                        {pieData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Budget Status */}
                    <div className="animate-fade-up stagger-3" style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.1)',
                        opacity: 0,
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'inline-block' }} />
                            Budget Status
                        </h3>
                        {budgetStatus.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</p>
                                <p style={{ fontWeight: 500 }}>No budgets set</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {budgetStatus.map((budget) => (
                                    <div key={budget.category}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>{budget.category}</span>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px',
                                                background: budget.percentage > 100 ? 'rgba(239,68,68,0.1)' : budget.percentage > 75 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                                color: budget.percentage > 100 ? '#ef4444' : budget.percentage > 75 ? '#f59e0b' : '#10b981',
                                            }}>
                                                {budget.percentage}%
                                            </span>
                                        </div>
                                        <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: '999px',
                                                width: `${Math.min(budget.percentage, 100)}%`,
                                                background: budget.percentage > 100 ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                                                    budget.percentage > 75 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                                        'linear-gradient(90deg, #6366f1, #06b6d4)',
                                                transition: 'width 1s ease',
                                                boxShadow: budget.percentage > 100 ? '0 0 8px rgba(239,68,68,0.5)' : '0 0 8px rgba(99,102,241,0.4)',
                                            }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Spent: {formatCurrency(budget.spent)}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Limit: {formatCurrency(budget.limit)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="animate-fade-up stagger-4" style={{
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.1)',
                    opacity: 0,
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'inline-block' }} />
                        Recent Transactions
                    </h3>
                    {transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</p>
                            <p style={{ fontWeight: 500 }}>No transactions this month</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {transactions.slice(0, 5).map((t, i) => (
                                <div key={t.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1rem 1.25rem', borderRadius: '14px',
                                    background: i % 2 === 0 ? 'rgba(99,102,241,0.03)' : 'transparent',
                                    border: '1px solid rgba(99,102,241,0.06)',
                                    transition: 'all 0.2s ease',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
                                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'rgba(99,102,241,0.03)' : 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            background: t.type === 'INCOME' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.1rem'
                                        }}>
                                            {t.type === 'INCOME' ? '💚' : '🔴'}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.95rem' }}>{t.description || t.category}</p>
                                            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p style={{
                                        fontWeight: 700, fontSize: '1rem',
                                        fontFamily: 'JetBrains Mono, monospace',
                                        color: t.type === 'INCOME' ? '#10b981' : '#ef4444'
                                    }}>
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