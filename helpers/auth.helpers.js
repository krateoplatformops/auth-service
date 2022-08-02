const cookie = (payload, provider) => {
  const u = {
    id: payload.id,
    displayName: payload.displayName,
    username: payload.username,
    provider,
    email: null
  }
  try {
    u.email = payload.emails[0].value
  } catch {}

  return u
}

module.exports = {
  cookie
}
