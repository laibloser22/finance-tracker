const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const transactionRoutes = require('./routes/transaction.routes')
const budgetRoutes = require('./routes/budget.routes')

const app = express()

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/budgets', budgetRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Finance Tracker API is running!' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})