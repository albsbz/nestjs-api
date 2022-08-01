import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdToString } from '../common/decorators/idToString.decorator';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
@IdToString
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(email: string, password: string): Promise<boolean> {
    const newUser = await this.userModel.findOneAndUpdate(
      { email },
      { $setOnInsert: { password } },
      { upsert: true, new: false },
    );
    return !newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, refreshToken: string): Promise<User> {
    const result = await this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
    return result;
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).lean();
  }

  public async confirmEmail(email: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email, emailIsConfirmed: false },
      { $set: { emailIsConfirmed: true } },
      { new: true },
    );

    return user;
  }
}
