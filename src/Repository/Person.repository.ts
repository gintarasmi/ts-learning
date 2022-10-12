import mongoose from 'mongoose';
import PersonModel, { IPersonModel } from '../Models/Person.model';
import { GenericRepository } from './Generic.repository';
import CatModel from '../Models/Cat.model';
import { IExtraPersonRepository } from '../Types/Repository.type';

export class PersonRepository
  extends GenericRepository
  implements IExtraPersonRepository
{
  dbModel = PersonModel;
  refModel = CatModel;

  async update(model: IPersonModel, newModel: IPersonModel) {
    model.set(newModel);
    return model.save();
  }
  async create(newModel: IPersonModel) {
    const model = new this.dbModel({
      _id: new mongoose.Types.ObjectId(),
      name: newModel.name,
      age: newModel.age
    });
    return model.save();
  }
  async findCat(id: string) {
    return this.refModel.findById(id).where('deletedAt').equals(null);
  }
  async addCat(model: IPersonModel, catId: string) {
    model.animals.push(catId);
    return model.save();
  }
  async getPopulatedById(id: string) {
    return this.dbModel
      .findById(id)
      .where('deletedAt')
      .equals(null)
      .populate({
        path: 'animals',
        match: { deletedAt: undefined }
      });
  }
  async getPeopleThatContainAnimalId(id: string) {
    return this.dbModel.find({ animals: id });
  }
}
