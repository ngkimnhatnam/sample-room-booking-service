const swaggerConfig = {
  info: {
    version: '1.0.0',
    title: 'Room booking service',
    description: 'API documentation for sample room booking service',
  },
  basePath: '/',
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

export default swaggerConfig;
