import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { PublicFilesRepository } from './publicFiles.repository';
import { PublicFile } from 'src/common/schemas/publicFile.schema';

@Injectable()
export class FilesService {
  constructor(
    private readonly publicFilesRepository: PublicFilesRepository,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('aws.publicBucketName'),
        Body: dataBuffer,
        Key: `avatars/${uuid()}-${encodeURI(filename)}`,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      })
      .promise();

    const newFile = await this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    return newFile;
  }
}
