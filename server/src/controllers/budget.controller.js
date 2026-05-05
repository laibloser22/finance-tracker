const { PrismaClient } = require('@prisma/client')
const { PrismaNeon } = require('@prisma/adapter-neon')

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Get budgets for current month
const getBudgets = async (req, res) => {
    try {
        const { month, year } = req.query
        const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1
        const currentYear = year ? parseInt(year) : new Date().getFullYear()

        const budgets = await prisma.budget.findMany({
            where: {
                userId: req.userId,
                month: currentMonth,
                year: currentYear
            }
        })

        res.json(budgets)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Create or update budget
const upsertBudget = async (req, res) => {
    try {
        const { category, amount, month, year } = req.body

        const budget = await prisma.budget.upsert({
            where: {
                userId_category_month_year: {
                    userId: req.userId,
                    category,
                    month: parseInt(month),
                    year: parseInt(year)
                }
            },
            update: { amount: parseInt(amount) },
            create: {
                category,
                amount: parseInt(amount),
                month: parseInt(month),
                year: parseInt(year),
                userId: req.userId
            }
        })

        res.json(budget)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Get budget status (limit vs spent)
const getBudgetStatus = async (req, res) => {
    try {
        const { month, year } = req.query
        const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1
        const currentYear = year ? parseInt(year) : new Date().getFullYear()

        const budgets = await prisma.budget.findMany({
            where: { userId: req.userId, month: currentMonth, year: currentYear }
        })

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: req.userId,
                type: 'EXPENSE',
                date: {
                    gte: new Date(currentYear, currentMonth - 1, 1),
                    lt: new Date(currentYear, currentMonth, 1)
                }
            }
        })

        const status = budgets.map(budget => {
            const spent = transactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0)

            return {
                category: budget.category,
                limit: budget.amount,
                spent,
                remaining: budget.amount - spent,
                percentage: Math.round((spent / budget.amount) * 100)
            }
        })

        res.json(status)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { getBudgets, upsertBudget, getBudgetStatus }