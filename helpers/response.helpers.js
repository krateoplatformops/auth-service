const parse = (data, includeConfig = false) => {
  const payload = {
    metadata: {
      name: data.metadata.name,
      uid: data.metadata.uid
    },
    spec: data.spec
  }

  if (!includeConfig) {
    delete payload.spec.config
  }
  delete payload.metadata.managedFields

  return payload
}

module.exports = {
  parse
}
