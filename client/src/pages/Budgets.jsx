import { useState } from 'react'
import useBudgets from '../hooks/useBudgets'

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other']

const CATEGORY_ICONS = {
    Food: '🍔', Rent: '🏠', Transport: '🚗', Entertainment: '🎮',
    Shopping: '🛍️', Health: '💊', Other: '📦'
}

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
            const res = await fetch('https://finance-tracker-api-xy6e.onrender.com/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    category: form.category,
                    amount: Math.round(parseFloat(form.amount) * 100),
                    month, year
                })
            })
            await res.json()
            const statusRes = await fetch(`https://finance-tracker-api-xy6e.onrender.com/api/budgets/status?month=${month}&year=${year}`, {
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

    const inputStyle = {
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.95rem',
        color: '#1e1b4b',
        width: '100%',
        outline: 'none',
    }

    const labelStyle = {
        display: 'block', fontWeight: 600, fontSize: '0.8rem',
        color: '#1e1b4b', marginBottom: '0.5rem',
        textTransform: 'uppercase', letterSpacing: '0.05em'
    }

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header */}
                <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.25rem' }}>Budgets</h2>
                        <p style={{ color: '#6b7280', fontWeight: 500 }}>Set monthly limits and track your spending</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        + Set Budget
                    </button>
                </div>

                {/* Filters */}
                <div className="animate-fade-up stagger-1" style={{
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    opacity: 0,
                }}>
                    <span style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Period:</span>
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        style={{ ...inputStyle, width: 'auto', padding: '0.5rem 1rem' }}
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
                        style={{ ...inputStyle, width: 'auto', padding: '0.5rem 1rem' }}
                    >
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>
                        {budgetStatus.length} budget{budgetStatus.length !== 1 ? 's' : ''} set
                    </span>
                </div>

                {/* Budget Cards */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</p>
                        <p style={{ fontWeight: 500 }}>Loading budgets...</p>
                    </div>
                ) : budgetStatus.length === 0 ? (
                    <div style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        borderRadius: '20px',
                        padding: '4rem',
                        textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.1)',
                    }}>
                        <p style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎯</p>
                        <p style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e1b4b', marginBottom: '0.5rem' }}>No budgets set yet</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Set monthly limits to track your spending</p>
                        <button onClick={() => setShowModal(true)} className="btn-primary">
                            + Set Your First Budget
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
                        {budgetStatus.map((budget, index) => (
                            <div
                                key={budget.category}
                                className={`animate-fade-up stagger-${Math.min(index + 1, 4)}`}
                                style={{
                                    background: 'rgba(255,255,255,0.6)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.9)',
                                    borderRadius: '20px',
                                    padding: '1.75rem',
                                    boxShadow: '0 8px 32px rgba(99,102,241,0.08)',
                                    transition: 'all 0.3s ease',
                                    opacity: 0,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(99,102,241,0.15)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.08)'
                                }}
                            >
                                {/* Card Header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '46px', height: '46px', borderRadius: '14px',
                                            background: budget.percentage > 100 ? 'rgba(239,68,68,0.1)' : budget.percentage > 75 ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.4rem',
                                            border: budget.percentage > 100 ? '1px solid rgba(239,68,68,0.2)' : budget.percentage > 75 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(99,102,241,0.15)',
                                        }}>
                                            {CATEGORY_ICONS[budget.category] || '📦'}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>{budget.category}</p>
                                            <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>Monthly Budget</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px',
                                        background: budget.percentage > 100 ? 'rgba(239,68,68,0.1)' : budget.percentage > 75 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                        color: budget.percentage > 100 ? '#ef4444' : budget.percentage > 75 ? '#f59e0b' : '#10b981',
                                        border: budget.percentage > 100 ? '1px solid rgba(239,68,68,0.2)' : budget.percentage > 75 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(16,185,129,0.2)',
                                    }}>
                                        {budget.percentage > 100 ? '🚨 Over' : budget.percentage > 75 ? '⚠️ Warning' : '✅ On Track'}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '999px', height: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{
                                        height: '100%', borderRadius: '999px',
                                        width: `${Math.min(budget.percentage, 100)}%`,
                                        background: budget.percentage > 100 ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                                            budget.percentage > 75 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                                'linear-gradient(90deg, #6366f1, #06b6d4)',
                                        boxShadow: budget.percentage > 100 ? '0 0 10px rgba(239,68,68,0.5)' :
                                            budget.percentage > 75 ? '0 0 10px rgba(245,158,11,0.5)' :
                                                '0 0 10px rgba(99,102,241,0.5)',
                                        transition: 'width 1s ease',
                                    }} />
                                </div>

                                {/* Stats */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Spent', value: formatCurrency(budget.spent), color: '#ef4444' },
                                        { label: 'Limit', value: formatCurrency(budget.limit), color: '#6366f1' },
                                        { label: 'Left', value: formatCurrency(budget.remaining), color: budget.remaining >= 0 ? '#10b981' : '#ef4444' },
                                    ].map(stat => (
                                        <div key={stat.label} style={{
                                            background: 'rgba(99,102,241,0.04)',
                                            borderRadius: '12px', padding: '0.75rem',
                                            textAlign: 'center',
                                            border: '1px solid rgba(99,102,241,0.08)',
                                        }}>
                                            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{stat.label}</p>
                                            <p style={{ fontWeight: 800, color: stat.color, fontSize: '0.95rem', fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Percentage */}
                                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>
                                        {budget.percentage}% of budget used
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(30,27,75,0.3)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.95)',
                        borderRadius: '24px',
                        padding: '2rem',
                        width: '100%', maxWidth: '420px',
                        boxShadow: '0 20px 60px rgba(99,102,241,0.2)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e1b4b' }}>🎯 Set Budget</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'rgba(99,102,241,0.08)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#6b7280' }}
                            >✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Monthly Limit ($)</label>
                                <input
                                    type="number" value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    style={inputStyle} placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '12px',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    background: 'transparent', color: '#6b7280',
                                    fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.95rem',
                                }}
                            >Cancel</button>
                            <button onClick={handleSubmit} className="btn-primary" style={{ flex: 1 }}>
                                Save Budget
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Budgets