const express = require('express')
const router = express.Router()

const readController = require('../controllers/auth/read.auth.controller')

router.use('/', readController)

module.exports = router
