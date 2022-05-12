module.exports = {
  tags: ['log'],
  description: 'Return all logs',
  operationId: 'getLogs',
  parameters: [],
  responses: {
    200: {
      description: 'All logs',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Log'
          }
        }
      }
    },
    500: {
      description: 'Server Error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Response'
          }
        }
      }
    }
  }
}
