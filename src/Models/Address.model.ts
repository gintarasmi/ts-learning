import mongoose, { Document, mongo, Schema } from 'mongoose';
import { IAddress } from '../Types/Address.type';

export interface IAddressModel extends IAddress, Document {}

export const AddressSchema: Schema = new Schema(
  {
    city: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    flatNumber: { type: String }
  },
  {
    versionKey: false
  }
);

//export default mongoose.model<IAddressModel>('Address', AddressSchema);
