import mongoose, { Document, Model } from 'mongoose';
import { DeletedAt } from '../Types/DeletedAt.type';
import {
  IRepository,
  IGenericRepositoryFunctions
} from '../Types/Repository.type';

export abstract class GenericRepository
  implements IRepository, IGenericRepositoryFunctions
{
  abstract dbModel: Model<any>;
  async getAll() {
    return this.dbModel.find().where('deletedAt').equals(null);
  }
  async getById(id: string) {
    return this.dbModel.findById(id).where('deletedAt').equals(null);
  }
  //delete
  async delete(modelToDelete: Document & DeletedAt) {
    modelToDelete.deletedAt = new Date(Date.now());
    return modelToDelete.save();
  }
  async getAllDeleted() {
    return this.dbModel.find().where('deletedAt').ne(null);
  }
  async restoreDeleted(modelToDelete: Document & DeletedAt) {
    modelToDelete.deletedAt = undefined;
    return modelToDelete.save();
  }
  async getByIdDeleted(id: string) {
    return this.dbModel.findById(id).where('deletedAt').ne(null);
  }
  async paging(pageNumber: number, pageSize: number) {
    return this.dbModel
      .find()
      .where('deletedAt')
      .equals(null)
      .skip(-pageSize + pageNumber * pageSize)
      .limit(pageSize);
  }
  async pagingOffset(first: number, offset: number) {
    return this.dbModel
      .find()
      .where('deletedAt')
      .equals(null)
      .skip(offset)
      .limit(first);
  }
  abstract create(newModel: object): Promise<any>;
  abstract update(model: Document, newModel: object): Promise<any>;
}
