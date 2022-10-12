import mongoose, { Document, Model } from 'mongoose';
import { IUserModel } from '../Models/User.model';
import { IHouseModel } from '../Models/House.model';
import { IPersonModel } from '../Models/Person.model';
import { DeletedAt } from './DeletedAt.type';

export interface IRepository {
  dbModel: Model<any>;
}

export interface IGenericRepositoryFunctions {
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  delete(modelToDelete: Document & DeletedAt): Promise<any>;
  restoreDeleted(modelToDelete: Document & DeletedAt): Promise<any>;
  getByIdDeleted(id: string): Promise<any>;
  getAllDeleted(): Promise<any>;
  paging(pageNumber: number, pageSize: number): Promise<any>;
  pagingOffset(first: number, offset: number): Promise<any>;
  create(newModel: Document): Promise<any>;
  update(model: Document, newModel: Document): Promise<any>;
}

export interface IRepositoryPopulation {
  getPopulatedById(id: string): Promise<any>;
}

export interface IExtraPersonRepository extends IRepositoryPopulation {
  addCat(model: IPersonModel, catId: string): Promise<any>;
  findCat(id: string): Promise<any>;
  getPeopleThatContainAnimalId(id: string): Promise<any>;
}

export interface IExtraHouseRepository extends IRepositoryPopulation {
  addPerson(model: IHouseModel, personId: string): Promise<any>;
  findPerson(id: string): Promise<any>;
}

export interface IExtraUserRepository {
  getByEmail(emailToFind: string): Promise<any>;
}
export interface ICatRepository
  extends IRepository,
    IGenericRepositoryFunctions {}

export interface IPersonRepository
  extends IRepository,
    IGenericRepositoryFunctions,
    IExtraPersonRepository {}

export interface IHouseRepository
  extends IRepository,
    IGenericRepositoryFunctions,
    IExtraHouseRepository {}
export interface IUserRepository
  extends IRepository,
    IGenericRepositoryFunctions,
    IExtraUserRepository {}
