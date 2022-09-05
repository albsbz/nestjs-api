import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { PublicFilesRepository } from './publicFiles.repository';
import { PublicFile } from 'src/common/schemas/publicFile.schema';
import { s3 } from 'src/config/s3';

@Injectable()
export class FilesService {
  constructor(
    private readonly publicFilesRepository: PublicFilesRepository,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    folder,
  ): Promise<PublicFile> {
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('aws.publicBucketName'),
        Body: dataBuffer,
        Key: `${folder}/${uuid()}-${encodeURI(filename)}`,
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

  async deletePublicFile(id, key): Promise<void> {
    await s3
      .deleteObject({
        Bucket: this.configService.get('aws.publicBucketName'),
        Key: key,
      })
      .promise(),
      await this.publicFilesRepository.delete(id);

    return;
  }
}
