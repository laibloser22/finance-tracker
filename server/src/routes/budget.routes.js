const express = require('express')
const router = express.Router()
const { getBudgets, upsertBudget, getBudgetStatus } = require('../controllers/budget.controller')
const authMiddleware = require('../middleware/auth.middleware')

// All routes are protected
router.use(authMiddleware)

router.get('/', getBudgets)
router.post('/', upsertBudget)
router.get('/status', getBudgetStatus)

module.exports = router