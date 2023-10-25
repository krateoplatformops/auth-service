const express = require('express')
const router = express.Router()
const passport = require('passport')

const {
  cookieConstants,
  envConstants
} = require('../../service-library/constants')
const logger = require('../../service-library/helpers/logger.helpers')
const jwtHelpers = require('../../service-library/helpers/jwt.helpers')
const authHelpers = require('../../helpers/auth.helpers')

router.get('/guest', async (req, res, next) => {
  try {
    // if (res.locals.provider.spec.strategy === 'guest') {
    const user = {
      id: 'guest',
      username: 'guest',
      provider: 'guest',
      email: 'guest@krateo.io',
      displayName: 'guest'
    }

    logger.debug(user)

    res.cookie(envConstants.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
    res.redirect(global.redirect)
    res.status(200)
    // } else {
    //   res.status(401).send()
    // }
  } catch (err) {
    next(err)
  }
})

router.get(
  '/github',
  passport.authenticate('github', { scope: ['read:user', 'read:org'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  async function (req, res, next) {
    console.debug('User info from GitHub: ' + JSON.stringify(req.user))
    const user = authHelpers.cookie(req.user, 'github')

    logger.debug('User info ready for cookie:' + user)
    res.cookie(process.env.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)

    res.redirect(global.redirect)
    res.status(200)
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
  }
})

module.exports = router
