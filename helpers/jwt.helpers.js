var jwt = require('jsonwebtoken')
const { envConstants } = require('./../constants')

const sign = (obj) => {
  return jwt.sign(obj, envConstants.COOKIE_SECRET)
}

const verify = (token) => {
  return jwt.verify(token, envConstants.COOKIE_SECRET)
}

module.exports = {
  sign,
  verify
}
