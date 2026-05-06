import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-bold text-blue-600">💰 FinanceTracker</h1>
                    <div className="flex gap-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
                            Dashboard
                        </Link>
                        <Link to="/transactions" className="text-gray-600 hover:text-blue-600 font-medium transition">
                            Transactions
                        </Link>
                        <Link to="/budgets" className="text-gray-600 hover:text-blue-600 font-medium transition">
                            Budgets
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">Hi, {user?.name}!</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar