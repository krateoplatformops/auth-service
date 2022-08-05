const parse = (data) => {
  const icon = data.spec.icon || 'fa-solid fa-code'
  const color = data.spec.color || 'blue'

  return {
    metadata: {
      name: data.metadata.name,
      uid: data.metadata.uid
    },
    ...data.spec,
    icon,
    color
  }
}

module.exports = {
  parse
}
