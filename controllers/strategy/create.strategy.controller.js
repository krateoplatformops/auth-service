const express = require('express')
const router = express.Router()
const fs = require('fs')
const Mustache = require('mustache')
const k8s = require('@kubernetes/client-node')

const k8sHelpers = require('../../service-library/helpers/k8s.helpers')
const logger = require('../../service-library/helpers/logger.helpers')
const stringHelpers = require('../../service-library/helpers/string.helpers')
const responseHelpers = require('../../helpers/response.helpers')
const yaml = require('js-yaml')

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

    const strategy = yaml.load(
      Mustache.render(payload, {
        ...placeholders,
        strategyName: req.body.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
      })
    )

    console.log(strategy)
    logger.debug(strategy)

    const doc = await k8sHelpers.create(client, strategy)

    res.status(200).json(responseHelpers.parse(doc))
  } catch (error) {
    next(error)
  }
})

module.exports = router
