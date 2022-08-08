const express = require('express')
const router = express.Router()
const passport = require('passport')

const { cookieConstants, envConstants } = require('../../constants')
const { logger } = require('../../helpers/logger.helpers')
const jwtHelpers = require('../../helpers/jwt.helpers')

router.post(
  '/ldap',
  passport.authenticate('ldapauth', { session: false }),
  (req, res) => {
    const user = {
      id: res.req.user.uid,
      displayName: res.req.user.displayName,
      username: res.req.user.username || res.req.user.uid,
      provider: 'ldap',
      email: null
    }
    try {
      user.email = Array.isArray(res.req.user.mail)
        ? res.req.user.mail[0]
        : res.req.user.mail
    } catch {}

    logger.info(user)

    res.cookie(envConstants.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
    res.status(200).send(user)
  }
)

router.post('/basic', (req, res) => {
  const user = {
    id: req.body.username,
    displayName: req.body.username,
    username: req.body.username,
    provider: 'basic',
    email: `${req.body.username}@krateo.io`
  }

  logger.info(user)

  res.cookie(envConstants.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
  res.status(200).send(user)
})

module.exports = router
