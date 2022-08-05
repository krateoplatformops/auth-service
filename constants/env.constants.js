module.exports = {
  PORT: process.env.PORT || 8080,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  COOKIE_NAME: process.env.COOKIE_NAME || 'krateo-platformops',
  JWT_SECRET: process.env.JWT_SECRET || 'krateo-platformops',
  JWT_ISSUER: process.env.JWT_ISSUER || 'krateo-platformops'
}
