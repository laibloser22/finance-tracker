const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { PrismaNeon } = require('@prisma/adapter-neon')

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } })
        res.json({ id: user.id, name: user.name, email: user.email })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { register, login, me }