const express = require('express')
const router = express.Router()
const yaml = require('js-yaml')

const { logger } = require('../../helpers/logger.helpers')
const responseHelpers = require('../../helpers/response.helpers')
const strategyHelpers = require('../../helpers/strategy.helpers')

router.get('/', async (req, res, next) => {
  try {
    const payload = await strategyHelpers.getList()

    logger.debug(payload)

    res.status(200).json({
      list: payload.items.map((i) => {
        return responseHelpers.parse(i)
      })
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:name', async (req, res, next) => {
  try {
    const payload = await strategyHelpers.getSingleByName(req.params.name)

    res.status(200).json(responseHelpers.parse(payload, true))
  } catch (error) {
    next(error)
  }
})

module.exports = router
