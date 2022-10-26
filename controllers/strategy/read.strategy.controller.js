const express = require('express')
const router = express.Router()
const k8sHelpers = require('../../service-library/helpers/k8s.helpers')
const { k8sConstants } = require('../../service-library/constants')
const responseHelpers = require('../../helpers/response.helpers')
const logger = require('../../service-library/helpers/logger.helpers')

router.get('/', async (req, res, next) => {
  try {
    const list = await k8sHelpers.getList(k8sConstants.strategyApi)

    logger.debug(k8sConstants.strategyApi)

    res.status(200).json({ list: list.map((x) => responseHelpers.parse(x)) })
  } catch (error) {
    next(error)
  }
})

router.get('/:name', async (req, res, next) => {
  try {
    const t = await k8sHelpers.getSingleByName(
      k8sConstants.strategyApi,
      req.params.name
    )

    res.status(200).json(responseHelpers.parse(t, true))
  } catch (error) {
    next(error)
  }
})

module.exports = router
