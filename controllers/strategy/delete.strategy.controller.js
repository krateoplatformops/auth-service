const express = require('express')
const router = express.Router()
const k8sHelpers = require('../../service-library/helpers/k8s.helpers')
const { k8sConstants } = require('../../service-library/constants')

router.delete('/:name', async (req, res, next) => {
  try {
    await k8sHelpers.deleteByName(k8sConstants.strategyApi, req.params.name)

    res
      .status(200)
      .json({ message: `Strategy with name ${req.params.name} deleted` })
  } catch (error) {
    next(error)
  }
})

module.exports = router
