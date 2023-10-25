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
// const k8sHelpers = require('../../service-library/helpers/k8s.helpers')
// const stringHelpers = require('../../service-library/helpers/string.helpers')
// const responseHelpers = require('../../helpers/response.helpers')
// const { k8sConstants } = require('../../service-library/constants')

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

// router.get('/github/callback', async (req, res, next) => {
//   logger.debug('inside callback')
//   try {
//     // if (res.locals.provider.spec.strategy === 'guest') {
//     const user = {
//       id: 'guestgithub',
//       username: 'guestgithub',
//       provider: 'guestgithub',
//       email: 'guestgithub@krateo.io',
//       displayName: 'guestgithub'
//     }

//     logger.debug(user)

//     res.cookie(envConstants.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
//     res.redirect(global.redirect)
//     res.status(200)
//   } catch (err) {
//     next(err)
//   }
// })

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  async function (req, res, next) {
    console.debug(req)
    console.debug(JSON.stringify.req)
    console.debug(res)
    console.debug(JSON.stringify.res)

    const user = authHelpers.cookie(req.user, 'microsoft')

    logger.debug(user)

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
