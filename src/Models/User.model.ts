import mongoose, { Document, mongo, Schema } from 'mongoose';
import { IUser } from '../Types/User.type';

export interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IUserModel>('User', UserSchema);
