import { useState } from 'react'
import useTransactions from '../hooks/useTransactions'

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Salary', 'Freelance', 'Other']

const formatCurrency = (amount) => `$${(amount / 100).toFixed(2)}`

const CATEGORY_ICONS = {
    Food: '🍔', Rent: '🏠', Transport: '🚗', Entertainment: '🎮',
    Shopping: '🛍️', Health: '💊', Salary: '💼', Freelance: '💻', Other: '📦'
}

function Transactions() {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({
        amount: '', type: 'EXPENSE', category: 'Food',
        description: '', date: new Date().toISOString().split('T')[0]
    })

    const { transactions, loading, setTransactions } = useTransactions(month, year)
    const token = localStorage.getItem('token')

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, amount: Math.round(parseFloat(form.amount) * 100) })
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
        transition: 'all 0.3s ease',
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
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.25rem' }}>Transactions</h2>
                        <p style={{ color: '#6b7280', fontWeight: 500 }}>Track every penny you earn and spend</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        + Add Transaction
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
                    <span style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter:</span>
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
                        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Transactions List */}
                <div className="animate-fade-up stagger-2" style={{
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.1)',
                    opacity: 0,
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</p>
                            <p style={{ fontWeight: 500 }}>Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💳</p>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#6b7280', marginBottom: '0.5rem' }}>No transactions found</p>
                            <p style={{ fontSize: '0.9rem' }}>Click "Add Transaction" to get started</p>
                        </div>
                    ) : (
                        <div>
                            {transactions.map((t, i) => (
                                <div
                                    key={t.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1.1rem 1.5rem',
                                        borderBottom: i < transactions.length - 1 ? '1px solid rgba(99,102,241,0.06)' : 'none',
                                        transition: 'all 0.2s ease',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '14px',
                                            background: t.type === 'INCOME' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.3rem', flexShrink: 0,
                                            border: t.type === 'INCOME' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.15)',
                                        }}>
                                            {CATEGORY_ICONS[t.category] || '📦'}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.95rem', marginBottom: '2px' }}>
                                                {t.description || t.category}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
                                                    background: t.type === 'INCOME' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                                                    color: t.type === 'INCOME' ? '#10b981' : '#ef4444',
                                                }}>{t.category}</span>
                                                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                                                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <p style={{
                                            fontWeight: 800, fontSize: '1.05rem',
                                            fontFamily: 'JetBrains Mono, monospace',
                                            color: t.type === 'INCOME' ? '#10b981' : '#ef4444',
                                        }}>
                                            {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </p>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            style={{
                                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                                                color: '#ef4444', padding: '6px 12px', borderRadius: '8px',
                                                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                                                fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.15)'}
                                            onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.08)'}
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
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.95)',
                        borderRadius: '24px',
                        padding: '2rem',
                        width: '100%', maxWidth: '460px',
                        boxShadow: '0 20px 60px rgba(99,102,241,0.2)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e1b4b' }}>Add Transaction</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'rgba(99,102,241,0.08)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#6b7280' }}
                            >✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div>
                                <label style={labelStyle}>Type</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['EXPENSE', 'INCOME'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setForm({ ...form, type })}
                                            style={{
                                                flex: 1, padding: '0.65rem', borderRadius: '10px',
                                                fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                                                cursor: 'pointer', transition: 'all 0.2s ease',
                                                border: form.type === type ? 'none' : '1px solid rgba(99,102,241,0.2)',
                                                background: form.type === type
                                                    ? type === 'EXPENSE'
                                                        ? 'linear-gradient(135deg, #ef4444, #f87171)'
                                                        : 'linear-gradient(135deg, #10b981, #06b6d4)'
                                                    : 'rgba(255,255,255,0.7)',
                                                color: form.type === type ? 'white' : '#6b7280',
                                                boxShadow: form.type === type ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                                            }}
                                        >
                                            {type === 'EXPENSE' ? '🔴 Expense' : '💚 Income'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Amount ($)</label>
                                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={inputStyle} placeholder="0.00" />
                            </div>

                            <div>
                                <label style={labelStyle}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Description</label>
                                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} placeholder="Optional note" />
                            </div>

                            <div>
                                <label style={labelStyle}>Date</label>
                                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
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
                                Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Transactions