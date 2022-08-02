const express = require('express')
const helmet = require('helmet')
const cors = require('cors')({ origin: true, credentials: true })
const responseTime = require('response-time')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')

const { envConstants } = require('./constants')

const app = express()
app.use(helmet())
app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(responseTime({ suffix: false, digits: 0 }))

/* MongoDB */
mongoose.Promise = global.Promise
mongoose.connect(envConstants.MONGODB_URI)
require('./models/provider.model')

/* Middlewares */
const callLoggerMiddleware = require('./middlewares/call-logger.middleware')
const providerMiddleware = require('./middlewares/provider.middleware')
const errorLoggerMiddleware = require('./middlewares/error-logger.middleware')

app.use(callLoggerMiddleware)
app.use(providerMiddleware)

/* OpenAPI */
const swaggerDocument = require('./openapi')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

/* Routes */
const statusRoutes = require('./routes/status.routes')
const strategyRoutes = require('./routes/strategy.routes')
const authRoutes = require('./routes/auth.routes')

app.use('/', statusRoutes)
app.use('/strategy', strategyRoutes)
app.use('/auth', authRoutes)

app.use(errorLoggerMiddleware)

module.exports = app
