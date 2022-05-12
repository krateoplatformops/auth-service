const m2s = require('mongoose-to-swagger')
const mongoose = require('mongoose')
const Provider = mongoose.model('Provider')

// const log = require('./paths/log')
const responseSchema = require('./schemas/response.schema')

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Krateo Auth Service API',
    description: 'Auth Service API for Krateo',
    version: '1.0.0',
    contact: {
      name: 'Krateo PlatformOps',
      email: 'contact@krateoplatformops.io',
      url: 'https://krateo.io'
    }
  },
  paths: {
    '/provider': {
      // get: log.get,
      // post: log.post
    }
  },
  components: {
    schemas: {
      Provider: m2s(Provider),
      Response: responseSchema
    }
  }
}
