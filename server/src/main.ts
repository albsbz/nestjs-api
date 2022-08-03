import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerOptions } from './config/swaggerOptions';
import { RenderService } from 'nest-next';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const service = app.get(RenderService);
  service.setErrorHandler(async (err, req, res) => {
    res.send(err.response);
  });
  app.enableCors({});
  app.useGlobalPipes(
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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerOptions);
  await app.listen(3000);
}
bootstrap();
