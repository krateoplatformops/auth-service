const parse = (data) => {
  return {
    metadata: {
      name: data.metadata.name,
      uid: data.metadata.uid
    },
    ...data.spec
  }
}

module.exports = {
  parse
}
