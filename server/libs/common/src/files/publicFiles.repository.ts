import { Inject, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { IdToString } from '../shared/decorators/idToString.decorator';
import {
  PublicFile,
  PublicFileSchema,
} from '../shared/schemas/publicFile.schema';

@Injectable()
@IdToString
export class PublicFilesRepository {
  private publicFileModel: Model<PublicFile>;
  async onModuleInit(): Promise<void> {
    this.publicFileModel = this.connection.model(
      PublicFile.name,
      PublicFileSchema,
    );
  }

  constructor(@Inject('MongooseConnection') private connection: Connection) {}

  public async create(params): Promise<PublicFile> {
    const publicFile = await this.publicFileModel.create(params);
    return publicFile;
  }

  public async delete(id): Promise<void> {
    await this.publicFileModel.deleteOne({ _id: id });
    return;
  }
}
