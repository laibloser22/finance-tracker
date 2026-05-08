import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navLinks = [
        { path: '/', label: 'Dashboard', icon: '⚡' },
        { path: '/transactions', label: 'Transactions', icon: '💳' },
        { path: '/budgets', label: 'Budgets', icon: '🎯' },
    ]

    return (
        <nav style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(99,102,241,0.15)',
            boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
                    }}>💰</div>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        FinanceTracker
                    </span>
                </div>

                {/* Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {navLinks.map(link => {
                        const isActive = location.pathname === link.path
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 16px', borderRadius: '10px',
                                    fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))' : 'transparent',
                                    color: isActive ? '#6366f1' : '#6b7280',
                                    border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                                    boxShadow: isActive ? '0 2px 10px rgba(99,102,241,0.15)' : 'none',
                                }}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* User + Logout */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 12px', borderRadius: '10px',
                        background: 'rgba(99,102,241,0.06)',
                        border: '1px solid rgba(99,102,241,0.12)'
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: '0.8rem'
                        }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e1b4b' }}>{user?.name}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px', borderRadius: '10px',
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#ef4444', fontWeight: 600, fontSize: '0.9rem',
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            fontFamily: 'Outfit, sans-serif'
                        }}
                        onMouseEnter={e => {
                            e.target.style.background = 'rgba(239,68,68,0.15)'
                            e.target.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={e => {
                            e.target.style.background = 'rgba(239,68,68,0.08)'
                            e.target.style.transform = 'translateY(0)'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar