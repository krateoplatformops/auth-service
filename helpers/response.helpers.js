const parse = (data, includeConfig = false) => {
  const icon = data.spec.icon || 'fa-solid fa-code'
  const color = data.spec.color || 'blue'

  const payload = {
    metadata: {
      name: data.metadata.name,
      uid: data.metadata.uid
    },
    ...data.spec,
    icon,
    color
  }

  if (!includeConfig) {
    delete payload.config
  }

  return payload
}

module.exports = {
  parse
}
