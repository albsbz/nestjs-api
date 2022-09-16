import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export const commonConfig = (app, configService): void => {
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const policies = {
    defaultSrc: ["'self'", configService.get('aws.formActionUrl')],
    'form-action': ["'self'", configService.get('aws.formActionUrl')],
    'script-src': ["'self'", configService.get('url')],
    'img-src': [
      "'self'",
      'data:',
      configService.get('aws.bucketUrlRegion'),
      configService.get('aws.bucketUrl'),
    ],
  };
  if (process.env.NODE_ENV !== 'production') {
    policies['script-src'].push("'unsafe-eval'");
  }
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: policies,
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      exceptionFactory(errors): unknown {
        return new BadRequestException(
          errors.map((error) => ({
            name: error.property,
            errors: Object.entries(error.constraints).map(([_, v]) => v),
          })),
        );
      },
    }),
  );
};
