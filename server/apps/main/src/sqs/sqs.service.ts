import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsService {
  sqs: SQS;
  constructor(private readonly configService: ConfigService) {
    this.sqs = new SQS();
  }

  async listQueues(): Promise<unknown> {
    const params = {};

    const queues = await this.sqs
      .listQueues(params, function (err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data.QueueUrls);
        }
      })
      .promise();
    return queues;
  }
}
