var jwt = require('jsonwebtoken')
const { envConstants } = require('./../constants')

const sign = (obj) => {
  return jwt.sign(obj, envConstants.JWT_SECRET, {
    issuer: envConstants.JWT_ISSUER,
    expiresIn: 60 * 1
  })
}

const verify = (token) => {
  jwt.verify(
    b,
    envConstants.JWT_SECRET,
    { issuer: envConstants.JWT_ISSUER },
    (err, decoded) => {
      if (err) {
        return false
      }

      return true
    }
  )
}

module.exports = {
  sign,
  verify
}
