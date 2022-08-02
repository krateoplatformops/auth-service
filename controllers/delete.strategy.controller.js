const express = require('express')
const router = express.Router()
const request = require('request')

const Mustache = require('mustache')
const yaml = require('js-yaml')
const k8s = require('@kubernetes/client-node')
const { logger } = require('../helpers/logger.helpers')
const stringHelpers = require('../helpers/string.helpers')

router.delete('/', async (req, res, next) => {
  try {
    const kc = new k8s.KubeConfig()
    kc.loadFromDefault()
    const client = k8s.KubernetesObjectApi.makeApiClient(kc)

    const opts = {}
    kc.applyToRequest(opts)
    const s = await new Promise((resolve, reject) => {
      request.delete(
        encodeURI(
          `${
            kc.getCurrentCluster().server
          }/apis/authn.krateo.io/v1alpha1/strategies/${req.body.name}`
        ),
        opts,
        (error, response, data) => {
          logger.debug(JSON.stringify(response))
          if (error) {
            logger.error(error)
            reject(error)
          } else resolve(data)
        }
      )
    })
    const response = yaml.load(s)

    logger.debug(response)

    res.status(response.code || 200).json({ message: response.message })
  } catch (error) {
    next(error)
  }
})

module.exports = router
