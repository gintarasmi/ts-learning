import mongoose from 'mongoose';
import HouseModel, { IHouseModel } from '../Models/House.model';
import { GenericRepository } from './Generic.repository';
import PersonModel, { IPersonModel } from '../Models/Person.model';
import { IExtraHouseRepository } from '../Types/Repository.type';

export class HouseRepository
  extends GenericRepository
  implements IExtraHouseRepository
{
  dbModel = HouseModel;
  refModel = PersonModel;

  async update(model: IHouseModel, newModel: IHouseModel) {
    model.set(newModel);
    return model.save();
  }
  async create(newModel: IHouseModel) {
    const model = new this.dbModel({
      _id: new mongoose.Types.ObjectId(),
      address: newModel.address
    });
    return model.save();
  }
  async findPerson(id: string) {
    return this.refModel.findById(id).where('deletedAt').equals(null);
  }
  async addPerson(model: IHouseModel, personId: string) {
    model.people.push(personId);
    return model.save();
  }
  // async addHouseToPerson(houseId: string, person: IPersonModel) {
  //   person.houses.push(houseId);
  //   return person.save();
  // }
  async getPopulatedById(id: string) {
    return this.dbModel
      .findById(id)
      .where('deletedAt')
      .equals(null)
      .populate({
        path: 'people',
        match: { deletedAt: null },
        populate: {
          path: 'animals',
          match: { deletedAt: null }
        }
      });
  }
}
