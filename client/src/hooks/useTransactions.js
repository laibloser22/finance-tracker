import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function useTransactions(month, year) {
    const [transactions, setTransactions] = useState([])
    const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 })
    const [loading, setLoading] = useState(true)
    const { token } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const headers = { Authorization: `Bearer ${token}` }
                const query = `?month=${month}&year=${year}`

                const [txRes, summaryRes] = await Promise.all([
                    fetch(`https://finance-tracker-api-xy6e.onrender.com/api/transactions${query}`, { headers }),
                    fetch(`https://finance-tracker-api-xy6e.onrender.com/api/transactions/summary${query}`, { headers })
                ])

                const txData = await txRes.json()
                const summaryData = await summaryRes.json()

                setTransactions(txData)
                setSummary(summaryData)
            } catch (error) {
                console.error('Error fetching transactions:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [month, year, token])

    return { transactions, summary, loading, setTransactions }
}

export default useTransactions