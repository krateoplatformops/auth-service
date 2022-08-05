const express = require('express')
const cors = require('cors')({ origin: true, credentials: true })
const responseTime = require('response-time')
const passport = require('passport')
const session = require('express-session')

const { envConstants } = require('./constants')

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
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(responseTime({ suffix: false, digits: 0 }))

/* Middlewares */
const callLoggerMiddleware = require('./middlewares/call-logger.middleware')
const providerMiddleware = require('./middlewares/provider.middleware')
const errorLoggerMiddleware = require('./middlewares/error-logger.middleware')

app.use(callLoggerMiddleware)
app.use(providerMiddleware)

/* OpenAPI */
// const swaggerDocument = require('./openapi')
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

/* Routes */
const statusRoutes = require('./routes/status.routes')
const strategyRoutes = require('./routes/strategy.routes')
const authRoutes = require('./routes/auth.routes')

app.use('/', statusRoutes)
app.use('/strategy', strategyRoutes)
app.use('/auth', authRoutes)

app.use(errorLoggerMiddleware)

module.exports = app
