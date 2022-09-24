import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { Cache } from 'cache-manager';

import { S3 } from 'aws-sdk';

import { getKeysFromString } from '../shared/helper/cast.helper';
import { PublicFilesRepository } from './publicFiles.repository';
import { UPLOAD_URL_EXPIRE, AWS, ONE_DAY } from '../shared/utils/constants';
import { PublicFile } from '../shared/schemas/publicFile.schema';
import { FileStatus } from '../shared/statuses/fileStatus.enum';

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

  async deletePublicFile(key): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: this._bucket,
        Key: key,
      })
      .promise();
    return;
  }

  async getUploadUrl(
    userId: string,
  ): Promise<{ form: S3.PresignedPost | undefined; sourceUrl: string }> {
    const sourceUrl = this.configService.get('aws.bucketUrlRegion');
    const cachedFormString: string = await this.cacheManager.get(userId);
    if (cachedFormString) {
      const form = JSON.parse(cachedFormString) as S3.PresignedPost;

      return { form, sourceUrl };
    }

    const tags = `<Tagging><TagSet><Tag><Key>status</Key><Value>${FileStatus.Delete}</Value></Tag></TagSet></Tagging>`;
    const params = {
      Bucket: this._bucket,
      Fields: {
        Tagging: tags,
      },
      Expires: UPLOAD_URL_EXPIRE,
      Conditions: [
        ['starts-with', '$Content-Type', 'image/'],
        ['starts-with', '$key', `${userId}/`],
        ['content-length-range', 0, 1000000], // content length restrictions: 0-1MB
        ['eq', '$x-amz-meta-userid', userId], // tag with userid
        ['eq', '$Tagging', tags], // tag with userid <= the user can see this!
      ],
    };

    const form = this.s3.createPresignedPost(params);

    this.cacheManager.set(userId, JSON.stringify(form), {
      ttl: UPLOAD_URL_EXPIRE - ONE_DAY,
    });
    return {
      form,
      sourceUrl,
    };
  }

  async changeStatus(keys: string[], status: string): Promise<boolean> {
    try {
      await Promise.allSettled(
        keys.map((key) => {
          return this.s3
            .putObjectTagging({
              Bucket: this._bucket,
              Key: key,
              Tagging: { TagSet: [{ Key: 'status', Value: status }] },
            })
            .promise();
        }),
      );
    } catch (e) {
      return false;
    }
    return true;
  }
}
