const express = require('express')
const cors = require('cors')({ origin: true, credentials: true })
const responseTime = require('response-time')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const k8sHelpers = require('./service-library/helpers/k8s.helpers')
k8sHelpers.init()

const { envConstants } = require('./service-library/constants')

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

const app = express()
app.use(cors)
app.use(
  session({
    secret: envConstants.JWT_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(responseTime({ suffix: false, digits: 0 }))

/* Middlewares */
const callLoggerMiddleware = require('./service-library/middlewares/call-logger.middleware')
const listMiddleware = require('./service-library/middlewares/list.middleware')
const errorLoggerMiddleware = require('./service-library/middlewares/error-logger.middleware')
const cookieIdentityMiddleware = require('./service-library/middlewares/cookie-identity.middleware')
const providerMiddleware = require('./middlewares/provider.middleware')

app.use(callLoggerMiddleware)
app.use(providerMiddleware)
app.use(cookieIdentityMiddleware)
app.use(listMiddleware)

/* Routes */
const statusRoutes = require('./service-library/routes/status.routes')
const strategyRoutes = require('./routes/strategy.routes')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')

app.use('/', statusRoutes)
app.use('/strategy', strategyRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.use(errorLoggerMiddleware)

module.exports = app
