const express = require('express')
const router = express.Router()
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
} = require('../controllers/transaction.controller')
const authMiddleware = require('../middleware/auth.middleware')

// All routes are protected
router.use(authMiddleware)

router.get('/', getTransactions)
router.post('/', createTransaction)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)
router.get('/summary', getSummary)

module.exports = router