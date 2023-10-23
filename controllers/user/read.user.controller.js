const express = require('express')
const logger = require('../../service-library/helpers/logger.helpers')
const router = express.Router()

const {
  cookieConstants,
  envConstants
} = require('../../service-library/constants')
const jwtHelpers = require('../../service-library/helpers/jwt.helpers')

router.get('/', async (req, res, next) => {
  try {
    logger.debug(JSON.stringify(res))

    if (!res.locals.identity) {
      res.clearCookie(envConstants.COOKIE_NAME, { ...cookieConstants })
      res.status(401).send()
      return
    }

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
