const express = require('express')
const router = express.Router()
const passport = require('passport')

const {
  cookieConstants,
  envConstants
} = require('../../service-library/constants')
const logger = require('../../service-library/helpers/logger.helpers')
const jwtHelpers = require('../../service-library/helpers/jwt.helpers')

router.post(
  '/ldap',
  passport.authenticate('ldapauth', { session: false }),
  (req, res) => {
    logger.debug(res.req)
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

    if (!user.id || user.id === '') {
      user.id = res.req.user.sAMAccountName
    }
    if (!user.username || user.username === '') {
      user.username = res.req.user.sAMAccountName
    }

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
