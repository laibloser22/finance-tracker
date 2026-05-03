const { PrismaClient } = require('@prisma/client')
const { PrismaNeon } = require('@prisma/adapter-neon')

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const { month, year, type, category } = req.query

        const where = { userId: req.userId }

        if (type) where.type = type
        if (category) where.category = category
        if (month && year) {
            where.date = {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1)
            }
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' }
        })

        res.json(transactions)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Create transaction
const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body

        const transaction = await prisma.transaction.create({
            data: {
                amount: parseInt(amount),
                type,
                category,
                description,
                date: new Date(date),
                userId: req.userId
            }
        })

        res.status(201).json(transaction)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Update transaction
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const { amount, type, category, description, date } = req.body

        const transaction = await prisma.transaction.update({
            where: { id: parseInt(id), userId: req.userId },
            data: {
                amount: parseInt(amount),
                type,
                category,
                description,
                date: new Date(date)
            }
        })

        res.json(transaction)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params

        await prisma.transaction.delete({
            where: { id: parseInt(id), userId: req.userId }
        })

        res.json({ message: 'Transaction deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Get summary
const getSummary = async (req, res) => {
    try {
        const { month, year } = req.query

        const where = { userId: req.userId }

        if (month && year) {
            where.date = {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1)
            }
        }

        const transactions = await prisma.transaction.findMany({ where })

        const income = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0)

        const expenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0)

        res.json({
            income,
            expenses,
            balance: income - expenses
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction, getSummary }