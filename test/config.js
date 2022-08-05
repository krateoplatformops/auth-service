const supertest = require('supertest')
const expect = require('chai').expect
require('dotenv').config()

const app = require('../app')

const hook =
  (method = 'post') =>
  (args) =>
    supertest(app)[method](args).set('x-dev', 'test')

const request = {
  post: hook('post'),
  get: hook('get'),
  put: hook('put'),
  delete: hook('delete')
}

module.exports = {
  request,
  expect
}
