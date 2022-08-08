const express = require('express')
const router = express.Router()

const createController = require('../controllers/auth/create.auth.controller')
const readController = require('../controllers/auth/read.auth.controller')

router.use('/', createController)
router.use('/', readController)

module.exports = router
