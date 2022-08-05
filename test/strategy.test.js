const { request, expect } = require('./config')

test('/strategy', async () => {
  const response = await request.get('/strategy')

  expect(response.status).to.eql(200)
})
