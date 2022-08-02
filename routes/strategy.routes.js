const express = require('express')
const router = express.Router()

const createController = require('../controllers/create.strategy.controller')
const readController = require('../controllers/read.strategy.controller')
const deleteController = require('../controllers/delete.strategy.controller')

router.use('/', createController)
router.use('/', readController)
router.use('/', deleteController)

module.exports = router
