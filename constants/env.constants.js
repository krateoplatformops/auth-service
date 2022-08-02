module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'krateo-platformops',
  COOKIE_NAME: process.env.COOKIE_NAME || 'krateo-platformops'
}
