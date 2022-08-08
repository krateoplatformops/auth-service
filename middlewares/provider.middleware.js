const axios = require('axios')
const passport = require('passport')
const { logger } = require('../helpers/logger.helpers')
const GitHubStrategy = require('passport-github2').Strategy
const MicrosoftStrategy = require('passport-microsoft').Strategy
const LdapStrategy = require('passport-ldapauth').Strategy
const { envConstants } = require('../constants')
const stringHelpers = require('../helpers/string.helpers')
const strategyHelpers = require('../helpers/strategy.helpers')
const responseHelpers = require('../helpers/response.helpers')

module.exports = async (req, res, next) => {
  const { name, redirect } = req.query
  if (
    req.path.indexOf('/auth/') > -1 &&
    req.path.indexOf('/callback') === -1 &&
    req.path.indexOf('/logout') === -1 &&
    name
  ) {
    if (!name) {
      return res.status(400).json({ message: 'Missing name param' })
    }
    if (!redirect && req.method === 'GET') {
      return res.status(400).json({ message: 'Missing redirect param' })
    }
    if (redirect) {
      global.redirect = redirect
    }

    const provider = responseHelpers.parse(
      await strategyHelpers.getSingleByName(name)
    )

    if (!provider) {
      const err = new Error(`Unknown authentication strategy`)
      err.statusCode = 500
      next(err)
      return
    }

    res.locals.provider = provider
    if (provider.strategy === 'guest') {
      next()
    } else {
      const config = JSON.parse(stringHelpers.b64toAscii(provider.config))
      if (provider.type === 'oauth') {
        config.callbackURL = `/auth/${provider.strategy}/callback`
      }
      logger.debug(
        `${provider.strategy} strategy config: ${JSON.stringify(
          config,
          null,
          2
        )}`
      )
      switch (provider.strategy) {
        case 'github':
          passport.use(
            new GitHubStrategy(
              config,
              (accessToken, refreshToken, profile, done) => {
                process.nextTick(() => {
                  return done(null, profile)
                })
              }
            )
          )
          break
        case 'microsoft':
          passport.use(
            new MicrosoftStrategy(
              config,
              (accessToken, refreshToken, profile, done) => {
                User.findOrCreate({ userId: profile.id }, function (err, user) {
                  return done(err, user)
                })
              }
            )
          )
          break
        case 'ldap':
          passport.use(new LdapStrategy(config))
          break
        case 'basic':
          if (JSON.stringify(config) !== JSON.stringify(req.body)) {
            const err = new Error(`Username or password is incorrect`)
            err.statusCode = 500
            next(err)
          }
          break
        default:
          logger.error(`${provider.strategy} strategy not supported`)
      }
      next()
    }
  } else {
    next()
  }
}
