import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdToString } from 'src/common/decorators/idToString.decorator';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
@IdToString
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email }).lean();
  }

  async remove(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, refreshToken: string): Promise<User> {
    const result = await this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
    return result;
  }

  async findById(userId: string): Promise<User | null> {
    return await this.userModel.findById(userId).lean();
  }
}
