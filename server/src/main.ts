import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { swaggerOptions } from './config/swaggerOptions';
import { RenderService } from 'nest-next';

async function bootstrap(): Promise<void> {
  const server = await NestFactory.create(AppModule);
  server.use(helmet({ contentSecurityPolicy: false }));

  const service = server.get(RenderService);
  service.setErrorHandler(async (err, req, res) => {
    if (res.statusCode !== 404) {
      res.send(err.response);
      return;
    }
  });
  // server.enableCors({});
  server.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('blog-api')
    .setDescription('blog-api description')
    .setVersion('1.0')
    .addTag('blog-api')
    .addBearerAuth(undefined, 'accessToken')
    .addBearerAuth(undefined, 'refreshToken')
    .build();
  const document = SwaggerModule.createDocument(server, config);
  SwaggerModule.setup('api', server, document, swaggerOptions);
  await server.listen(3000);
}
bootstrap();
