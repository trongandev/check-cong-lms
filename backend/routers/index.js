const express = require('express')
const router = express.Router()
// ping check server is running
router.use('/ping', (req, res) => {
    res.status(200).json({ message: "yeah! I'm alive 😒😒" })
})

// Authentication routes
router.use('/auth', require('./auth.router'))

router.use('/profile', require('./profile.router'))

router.use('/config', require('./config.router'))
router.use('/salary', require('./salary.router'))
router.use('/oh', require('./officehours.router'))

module.exports = router
