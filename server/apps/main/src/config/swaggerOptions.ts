export const swaggerOptions = {
  swaggerOptions: {
    authAction: {
      accessToken: {
        name: 'accessToken',
        schema: {
          description: 'accessToken',
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        value: 'thisIsASampleBearerAuthToken123',
      },
      refreshToken: {
        name: 'refreshToken',
        schema: {
          description: 'accessToken',
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        value: 'thisIsASampleBearerAuthToken123',
      },
    },
  },
};
