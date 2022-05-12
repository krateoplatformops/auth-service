module.exports = {
  tags: ['log'],
  description: 'Add and return single log',
  operationId: 'addLog',
  requestBody: {
    description: 'Optional description in *Markdown*',
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Log'
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Log added',
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
