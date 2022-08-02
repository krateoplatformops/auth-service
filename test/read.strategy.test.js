const { request, expect } = require('./config')

describe('GET /strategy', function () {
  it('returns list of strategy', async function () {
    const response = await request.get('/strategy')

    expect(response.status).to.eql(200)
  })
})
