const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}))
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Finance Tracker API is running!' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})