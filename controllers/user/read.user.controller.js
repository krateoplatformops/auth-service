const express = require('express')
const router = express.Router()

const { cookieConstants, envConstants } = require('../../constants')
const jwtHelpers = require('../../helpers/jwt.helpers')

router.get('/', async (req, res, next) => {
  try {
    res.cookie(
      envConstants.COOKIE_NAME,
      jwtHelpers.sign(res.locals.identity),
      cookieConstants
    )
    res.status(200).send({
      ...res.locals.identity
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
