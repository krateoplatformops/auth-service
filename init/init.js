const k8s = require('@kubernetes/client-node')
const k8sHelpers = require('../service-library/helpers/k8s.helpers')
const { k8sConstants } = require('../service-library/constants')
const logger = require('../service-library/helpers/logger.helpers')
const stringHelpers = require('../service-library/helpers/string.helpers')

const strategy = require('./basic-strategy.json')
const secret = require('./secret-strategy.json')

const defaultStrategy = async () => {
  const list = await k8sHelpers.getList(k8sConstants.strategyApi)
  logger.info(`There are ${list.length} strategies`)

  if (list.length === 0) {
    logger.info('Creating default strategy')
    const kc = new k8s.KubeConfig()
    kc.loadFromDefault()
    const client = k8s.KubernetesObjectApi.makeApiClient(kc)

    // Generate random password
    const password = Math.random().toString(36).slice(-8)
    const username = 'krateo'

    strategy.spec.config = stringHelpers.to64(
      JSON.stringify({ username, password })
    )
    secret.stringData.password = password
    secret.stringData.username = username

    await Promise.all([
      k8sHelpers.create(client, strategy),
      k8sHelpers.create(client, secret)
    ])

    logger.info('Default strategy created')
  }
}

module.exports = { defaultStrategy }
