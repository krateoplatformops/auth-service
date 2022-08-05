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
      strategies: payload.items.map((i) => {
        return responseHelpers.parse(i)
      })
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:uid', async (req, res, next) => {
  try {
    res.status(200).json(await strategyHelpers.getSingleByUid(req.params.uid))
  } catch (error) {
    next(error)
  }
})

module.exports = router
