const express = require('express')
const router = express.Router()

const createController = require('../controllers/strategy/create.strategy.controller')
const readController = require('../controllers/strategy/read.strategy.controller')
const deleteController = require('../controllers/strategy/delete.strategy.controller')

router.use('/', createController)
router.use('/', readController)
router.use('/', deleteController)

module.exports = router
