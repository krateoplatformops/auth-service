const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { dbConstants } = require('../constants')

const providerSchema = new Schema({
  strategy: {
    required: true,
    type: String
  },
  config: {
    required: false,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  enabled: {
    required: true,
    type: Boolean,
    default: true
  },
  type: {
    required: true,
    type: String,
    default: 'oauth'
  }
})

providerSchema.index({ provider: 1 }, { name: 'providerIndex' })

module.exports = mongoose.model(
  'Provider',
  providerSchema,
  dbConstants.COLLECTION_PROVIDER
)
