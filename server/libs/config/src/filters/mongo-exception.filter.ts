import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { Error, MongooseError } from 'mongoose';

@Catch(Error)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(
    exception: Error & { errors: MongooseError[] },
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(400).json({
      statusCode: 400,
      message: exception.errors
        ? Object.entries(exception.errors).map(([idx, v]) => ({
            name: idx,
            errors: [v.message],
          }))
        : { errors: exception },
      error: 'Bad Request',
    });
  }
}