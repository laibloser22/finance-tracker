import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })
            const data = await res.json()
            if (!res.ok) { setError(data.message); return }
            login(data.token, data.user)
            navigate('/')
        } catch {
            setError('Something went wrong. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f0f4ff',
            backgroundImage: `
        radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.2) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 10%, rgba(16,185,129,0.1) 0%, transparent 40%)
      `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Outfit, sans-serif',
        }}>

            {/* Floating orbs */}
            <div style={{ position: 'fixed', top: '15%', right: '10%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '15%', left: '10%', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite reverse', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '440px' }}>

                {/* Logo */}
                <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px', margin: '0 auto 1rem',
                        boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
                        animation: 'float 3s ease-in-out infinite',
                    }}>🚀</div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.25rem' }}>Create account</h1>
                    <p style={{ color: '#6b7280', fontWeight: 500 }}>Start tracking your finances today</p>
                </div>

                {/* Card */}
                <div className="animate-fade-up stagger-1" style={{
                    background: 'rgba(255,255,255,0.65)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    boxShadow: '0 8px 40px rgba(99,102,241,0.15), 0 2px 8px rgba(0,0,0,0.04)',
                    opacity: 0,
                }}>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
                            color: '#ef4444', fontSize: '0.9rem', fontWeight: 500,
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1e1b4b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-glass"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1e1b4b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-glass"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1e1b4b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-glass"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1, background: 'linear-gradient(135deg, #10b981, #06b6d4)', boxShadow: '0 4px 15px rgba(16,185,129,0.4)' }}
                        >
                            {loading ? '⏳ Creating account...' : '✨ Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7280', marginTop: '1.5rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register