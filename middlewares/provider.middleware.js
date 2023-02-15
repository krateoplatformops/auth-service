const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const MicrosoftStrategy = require('passport-microsoft').Strategy
const LdapStrategy = require('passport-ldapauth').Strategy

const logger = require('../service-library/helpers/logger.helpers')
const stringHelpers = require('../service-library/helpers/string.helpers')
const k8sHelpers = require('../service-library/helpers/k8s.helpers')
const responseHelpers = require('../helpers/response.helpers')
const { k8sConstants } = require('../service-library/constants')

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

    let strategy = null
    try {
      strategy = await k8sHelpers.getSingleByName(
        k8sConstants.strategyApi,
        name
      )
    } catch {}

    if (!strategy) {
      const err = new Error('Cannot find strategy')
      err.statusCode = 500
      next(err)
      return
    }

    const provider = responseHelpers.parse(strategy, true)

    if (!provider) {
      const err = new Error('Unknown authentication strategy')
      err.statusCode = 500
      next(err)
      return
    }

    res.locals.provider = provider
    if (provider.spec.strategy === 'guest') {
      console.log(provider.spec.strategy)
      next()
    } else {
      const config = JSON.parse(stringHelpers.b64toAscii(provider.spec.config))
      if (provider.spec.type === 'oauth') {
        config.callbackURL = `/auth/${provider.strategy}/callback`
      }
      logger.debug(
        `${provider.spec.strategy} strategy config: ${JSON.stringify(
          config,
          null,
          2
        )}`
      )
      switch (provider.spec.strategy) {
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
                // Create user?
              }
            )
          )
          break
        case 'ldap':
          if (!config.server) {
            config.server = {
              ...config
            }
          }
          passport.use(new LdapStrategy(config))
          break
        case 'basic':
          if (JSON.stringify(config) !== JSON.stringify(req.body)) {
            const err = new Error('Username or password is incorrect')
            err.statusCode = 500
            next(err)
          }
          break
        default:
          logger.error(`${provider.sepc.strategy} strategy not supported`)
      }
      next()
    }
  } else {
    next()
  }
}
