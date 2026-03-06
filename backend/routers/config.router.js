const express = require('express')

const { authenticateToken } = require('../middlewares/auth.middleware.js')
const configController = require('../controllers/config.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', authenticateToken, configController.getConfigDefault)
router.post('', authenticateToken, configController.createConfigDefault)
router.patch('', authenticateToken, configController.updateLinkSheet)
router.delete('/:_id', authenticateToken, configController.deleteLinkSheet)

module.exports = router
