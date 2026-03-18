import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tanzania Tech Nexus API',
      version: '1.0.0',
      description: 'Complete API documentation for Tanzania Tech Nexus e-commerce platform',
      contact: {
        name: 'Tanzania Tech Nexus',
        email: 'support@tanzaniatechnexus.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
   