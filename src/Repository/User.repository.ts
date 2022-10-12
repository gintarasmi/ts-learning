import mongoose from 'mongoose';
import UserModel, { IUserModel } from '../Models/User.model';
import { GenericRepository } from './Generic.repository';
import { IUser } from '../Types/User.type';
import { IExtraUserRepository } from '../Types/Repository.type';

export class UserRepository
  extends GenericRepository
  implements IExtraUserRepository
{
  dbModel = UserModel;
  async update(model: IUserModel, newModel: IUserModel) {
    model.set(newModel);
    return model.save();
  }
  async create(newModel: IUserModel) {
    const model = new this.dbModel({
      _id: new mongoose.Types.ObjectId(),
      email: newModel.email,
      password: newModel.password
    });
    return model.save();
  }
  async getByEmail(emailToFind: string) {
    return this.dbModel.findOne({ email: emailToFind }).exec();
  }
}
