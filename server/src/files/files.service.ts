import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { PublicFilesRepository } from './publicFiles.repository';
import { PublicFile } from 'src/common/schemas/publicFile.schema';
// import { s3 } from 'src/config/s3';
import { Cache } from 'cache-manager';
import {
  ONE_DAY,
  REDIS,
  UPLOAD_URL_EXPIRE,
  AWS,
} from 'src/common/utils/constants';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  _bucket: string;
  s3: S3;
  constructor(
    private readonly publicFilesRepository: PublicFilesRepository,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this._bucket = configService.get('aws.publicBucketName');
    this.s3 = new S3({
      region: configService.get('aws.region'),
      signatureVersion: 'v4',
      credentials: {
        accessKeyId: configService.get('aws.accessKeyId'),
        secretAccessKey: configService.get('aws.secretAccessKey'),
      },
    });
  }

  private generateKey(folder: string, filename?: string): string {
    let key = `${folder}/`;
    if (filename) key = key + `${uuid()}-${encodeURI(filename)}`;
    return key;
  }

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    folder,
  ): Promise<PublicFile> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this._bucket,
        Body: dataBuffer,
        Key: this.generateKey(folder, filename),
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
    await this.s3
      .deleteObject({
        Bucket: this._bucket,
        Key: key,
      })
      .promise(),
      await this.publicFilesRepository.delete(id);

    return;
  }

  async getUploadUrl(userId: string): Promise<S3.PresignedPost> {
    const cachedFormString: string = await this.cacheManager.get(
      `${REDIS.UPLOAD_URL}:${userId}`,
    );
    if (cachedFormString) {
      const cachedForm = JSON.parse(cachedFormString) as S3.PresignedPost;
      const [expiresIn] = cachedForm.url.match(/(?<=Expires\=)(.*)(?=\&)/i);
      if (expiresIn && Number(expiresIn) - Date.now() < ONE_DAY) {
        return cachedForm;
      }
    }
    const params = {
      Bucket: this._bucket,
      Fields: {},

      Expires: UPLOAD_URL_EXPIRE,
      Conditions: [
        ['starts-with', '$Content-Type', 'image/'],
        ['starts-with', '$key', `${AWS.ARTICLE_IMAGES_FOLDER}/`],
        // ['content-length-range', 0, 1000000], // content length restrictions: 0-1MB
        // ['eq', '$x-amz-meta-userid', userId], // tag with userid <= the user can see this!
      ],
    };

    const cachedForm = this.s3.createPresignedPost(params);
    this.cacheManager.set(
      `${REDIS.UPLOAD_URL}:${userId}`,
      JSON.stringify(cachedForm),
      {
        ttl: UPLOAD_URL_EXPIRE,
      },
    );

    return cachedForm;
  }
}
