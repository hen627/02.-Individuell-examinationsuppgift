const jwt = require('jsonwebtoken');
const { sendError } = require('../responses');

const validateToken = () => ({
  before: async (request) => {
    try {
      const authorizationHeader = request.event.headers.authorization;

      if (!authorizationHeader) {
        throw new Error('Missing token');
      }

      const token = authorizationHeader.replace('Bearer ', '');

      if (!token) {
        throw new Error('Missing token');
      }

      const data = jwt.verify(token, 'h3ll0');

      request.event.id = data.id;
      request.event.username = data.username;

      return request.response;
    } catch (error) {
        const validateToken = () => ({
            before: async (request) => {
              try {
                const authorizationHeader = request.event.headers.authorization;
          
                if (!authorizationHeader) {
                  throw new Error('Missing token');
                }
          
                const token = authorizationHeader.replace('Bearer ', '');
          
                if (!token) {
                  throw new Error('Missing token');
                }
          
                const data = jwt.verify(token, 'h3ll0');
          
                request.event.id = data.id;
                request.event.username = data.username;
          
                return request.response;
              } catch (error) {
                if (error.name === 'TokenExpiredError') {
                  throw new Error('Token expired');
                } else {
                  throw error;
                }
              }
            },
            onError: async (request) => {
              console.error('Error:', request.error.message);
              request.event.error = '401';
              return request.response;
            }
          });
          
          module.exports = { validateToken };
          
      throw error;
    }
  },
  onError: async (request) => {
    console.error('Error:', request.error.message);
    request.event.error = '401';
    return request.response;
  }
});

module.exports = { validateToken };