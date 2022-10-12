import mongoose, { Document, mongo, Schema } from 'mongoose';
import { IPerson } from '../Types/Person.type';

export interface IPersonModel extends IPerson, Document {}

export const PersonSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    animals: { type: [Schema.Types.ObjectId], ref: 'Cat' },
    // houses: { type: [Schema.Types.ObjectId], ref: 'House' },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IPersonModel>('Person', PersonSchema);
