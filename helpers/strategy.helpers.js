const k8s = require('@kubernetes/client-node')
const request = require('request')
const logger = require('../helpers/logger.helpers')
const yaml = require('js-yaml')

const strategyConstants = require('../constants/strategy.constants')

const getList = async () => {
  const kc = new k8s.KubeConfig()
  kc.loadFromDefault()

  const opts = {}
  kc.applyToRequest(opts)
  const s = await new Promise((resolve, reject) => {
    request(
      encodeURI(`${kc.getCurrentCluster().server}${strategyConstants.api}`),
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

  const payload = yaml.load(s)

  return payload
}

const getSingleByName = async (name) => {
  const kc = new k8s.KubeConfig()
  kc.loadFromDefault()

  const opts = {}
  kc.applyToRequest(opts)
  const s = await new Promise((resolve, reject) => {
    request(
      encodeURI(
        `${kc.getCurrentCluster().server}${strategyConstants.api}/${name}`
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

  const payload = yaml.load(s)

  return payload
}

module.exports = {
  getList,
  getSingleByName
}
