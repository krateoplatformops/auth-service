const mongoose = require('mongoose')
const Provider = mongoose.model('Provider')
const { logger } = require('../helpers/logger.helpers')

const initGuest = async () => {
  Provider.countDocuments()
    .then((count) => {
      if (count === 0) {
        Provider.create({
          name: 'guest',
          enabled: true,
          strategy: 'guest',
          type: 'oauth'
        })
        logger.info('Guest provider created')
      }
    })
    .catch((err) => {
      logger.error(err)
    })
}

module.exports = initGuest
