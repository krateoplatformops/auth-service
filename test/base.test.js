const { request, expect } = require('./config')

const packageJson = require('../package.json')

test('/ping', async () => {
  const response = await request.get('/ping')

  expect(response.status).to.eql(200)
  expect(response.body.name).to.eql(packageJson.name)
})
