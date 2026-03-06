const express = require('express')

const { authenticateToken } = require('../middlewares/auth.middleware.js')
const salaryController = require('../controllers/salary.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', authenticateToken, salaryController.getSalary)

module.exports = router
