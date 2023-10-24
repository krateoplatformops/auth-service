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
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get('/github/callback', (req, res, next) => {
  // logger.debug('1')
  // let strategy = null
  // try {
  //   strategy = await k8sHelpers.getSingleByName(
  //     k8sConstants.strategyApi,
  //     'github'
  //   )
  // } catch (error) {
  //   next(error)
  // }

  // logger.debug('2')
  // logger.debug(strategy)

  // if (!strategy) {
  //   const err = new Error('Cannot find strategy')
  //   err.statusCode = 500
  //   next(err)
  //   return
  // }

  // const provider = responseHelpers.parse(strategy, true)

  // logger.debug('3')
  // logger.debug(provider)

  // if (!provider) {
  //   const err = new Error('Unknown authentication strategy')
  //   err.statusCode = 500
  //   next(err)
  //   return
  // }

  // const config = JSON.parse(stringHelpers.b64toAscii(provider.spec.config))

  // logger.debug('4')
  // logger.debug(config)
  // logger.debug(req)
  // const grantCode = req.query.code

  // const tokenURL = config.tokenURL
  // const userProfileURL = config.userProfileURL
  // const clientId = config.clientID
  // const clientSecret = config.clientSecret
  const userInfo = {}

  // logger.debug('----> new UserInfo')

  // fetch(
  //   tokenURL +
  //   '?client_id=' +
  //   clientId +
  //   '&client_secret=' +
  //   clientSecret +
  //   '&code=' +
  //   grantCode,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json'
  //     }
  //   }
  // )
  //   .then((res) => res.json())
  //   .then((json) => {
  //     logger.debug('5')
  //     logger.debug(json)
  //     req.session.github_token = json.access_token
  //     logger.debug('6')
  //     logger.debug(req.session.github_token)
  //   })
  //   .catch((err) => console.log(err))
  //   .then(() => {
  //     fetch(userProfileURL, {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         Authorization: 'Bearer ' + req.session.github_token
  //       }
  //     })
  //       .then((res) => res.json())
  //       .then((json) => {
  //         logger.debug('7')
  //         userInfo.id = json.id
  //         userInfo.displayName = json.name
  //         userInfo.username = json.login
  //         userInfo.email = json.email
  //       })
  //       .catch((err) => console.log(err))
  //   })

  userInfo.id = '1'
  userInfo.displayName = 'lb'
  userInfo.username = 'userlb'
  userInfo.email = 'myemail'

  logger.debug('8')
  logger.debug(JSON.stringify(userInfo))
  const user = authHelpers.cookie(userInfo, 'github')

  logger.debug('9')
  logger.debug(user)

  res.cookie(envConstants.COOKIE_NAME, jwtHelpers.sign(user), cookieConstants)
  res.redirect(global.redirect)
})

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
