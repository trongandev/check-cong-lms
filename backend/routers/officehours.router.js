const express = require('express')

const { authenticateToken, checkRoleAdmin } = require('../middlewares/auth.middleware.js')
const officehoursController = require('../controllers/officehours.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', authenticateToken, checkRoleAdmin, officehoursController.getAll)
router.get('/username', authenticateToken, officehoursController.getByUsername)
router.post('/', authenticateToken, checkRoleAdmin, officehoursController.create)
router.delete('/:id', authenticateToken, checkRoleAdmin, officehoursController.delete)

module.exports = router
