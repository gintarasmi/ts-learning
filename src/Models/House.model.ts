import mongoose, { Document, mongo, Schema } from 'mongoose';
import { IHouse } from '../Types/House.type';
import { AddressSchema } from '../Models/Address.model';

export interface IHouseModel extends IHouse, Document {}

const HouseSchema: Schema = new Schema(
  {
    address: { type: AddressSchema, required: true },
    people: { type: [Schema.Types.ObjectId], ref: 'Person' },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IHouseModel>('House', HouseSchema);
