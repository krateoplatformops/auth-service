const express = require('express')
const router = express.Router()

const readController = require('../controllers/user/read.user.controller')

router.use('/', readController)

module.exports = router
