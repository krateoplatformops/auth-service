const express = require('express')
const router = express.Router()
const passport = require('passport')

const { cookieConstants, envConstants } = require('../../constants')
const jwtHelpers = require('../../helpers/jwt.helpers')
const authHelpers = require('../../helpers/auth.helpers')
const { logger } = require('../../helpers/logger.helpers')

router.get('/guest', async (req, res, next) => {
  try {
    if (res.locals.provider.strategy === 'guest') {
      const user = {
        id: 'guest',
        username: 'guest',
        provider: 'guest',
        email: 'guest@krateo.io'
      }

      logger.debug(user)
      console.log(user)

      res.cookie(
        envConstants.COOKIE_NAME,
        jwtHelpers.sign(user),
        cookieConstants
      )
      res.redirect(global.redirect)
      res.status(200)
    } else {
      res.status(401).send()
    }
  } catch (err) {
    next(err)
  }
})

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    const user = authHelpers.cookie(req.user, 'github')

    logger.debug(user)

    res.cookie(envConstants.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
    res.redirect(global.redirect)
  }
)

router.get(
  '/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
)

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    const user = authHelpers.cookie(req.user, 'microsoft')

    logger.debug(user)

    res.cookie(process.env.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
    res.redirect(global.redirect)
  }
)

router.get('/logout', async (req, res, next) => {
  try {
    res.clearCookie(envConstants.COOKIE_NAME, { ...cookieConstants })
    res.status(200).send()
  } catch (error) {
    next(error)
    return
  }
})

module.exports = router
