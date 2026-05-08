import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function useBudgets(month, year) {
    const [budgetStatus, setBudgetStatus] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const headers = { Authorization: `Bearer ${token}` }
                const query = `?month=${month}&year=${year}`

                const res = await fetch(`https://finance-tracker-api-xy6e.onrender.com/api/budgets/status${query}`, { headers })
                const data = await res.json()
                setBudgetStatus(data)
            } catch (error) {
                console.error('Error fetching budgets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [month, year, token])

    return { budgetStatus, loading, setBudgetStatus }
}

export default useBudgets