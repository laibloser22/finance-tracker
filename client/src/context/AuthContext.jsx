import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            fetch('https://finance-tracker-api-xy6e.onrender.com/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.id) setUser(data)
                    else logout()
                })
                .catch(() => logout())
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [token])

    const login = (token, user) => {
        localStorage.setItem('token', token)
        setToken(token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}