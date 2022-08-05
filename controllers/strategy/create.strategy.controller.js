const express = require('express')
const router = express.Router()
const fs = require('fs')

const Mustache = require('mustache')
const yaml = require('js-yaml')
const k8s = require('@kubernetes/client-node')
const { logger } = require('../../helpers/logger.helpers')
const stringHelpers = require('../../helpers/string.helpers')

const responseHelpers = require('../../helpers/response.helpers')

router.post('/', async (req, res, next) => {
  try {
    const kc = new k8s.KubeConfig()
    kc.loadFromDefault()
    const client = k8s.KubernetesObjectApi.makeApiClient(kc)

    // placeholders
    const payload = fs.readFileSync('./strategy.yaml', 'utf8')
    logger.debug(payload)
    Mustache.escape = (text) => {
      return text
    }
    const placeholders = {
      ...req.body,
      config: stringHelpers.to64(JSON.stringify(req.body.config))
    }

    const strategy = Mustache.render(payload, {
      ...placeholders,
      strategyName: req.body.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    })

    logger.debug(strategy)

    await client
      .create(yaml.load(strategy))
      .then((response) => {
        logger.info('Created strategy')

        res.status(200).json(responseHelpers.parse(response.body))
      })
      .catch((e) => {
        next(e)
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router
