import mongoose from 'mongoose';
import CatModel, { ICatModel } from '../Models/Cat.model';
import { GenericRepository } from './Generic.repository';

export class CatRepository extends GenericRepository {
  dbModel = CatModel;
  async update(model: ICatModel, newModel: ICatModel) {
    model.set(newModel);
    return model.save();
  }
  async create(newModel: ICatModel) {
    const model = new this.dbModel({
      _id: new mongoose.Types.ObjectId(),
      givenName: newModel.givenName,
      age: newModel.age,
      breed: newModel.breed,
      weight: newModel.weight,
      eyeColor: newModel.eyeColor
    });
    return await model.save();
  }
  //nes negauna type kitaip
  async getById(id: string) {
    return this.dbModel.findById(id).where('deletedAt').equals(null);
  }
}
