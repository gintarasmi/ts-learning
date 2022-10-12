import { Request, Response } from 'express';
import { GraphQLObjectType } from 'graphql';
import { ICat } from './Cat.type';
import { IRepository } from './Repository.type';

export interface IService {
  repository?: IRepository;
  getById: (req: Request, res: Response) => Promise<any>;
}

export interface IGenericServiceFunctions {
  getAll: (req: Request, res: Response) => Promise<any>;
  getById: (req: Request, res: Response) => Promise<any>;
  delete: (req: Request, res: Response) => Promise<any>;
  getAllDeleted: (req: Request, res: Response) => Promise<any>;
  restoreDeleted: (req: Request, res: Response) => Promise<any>;
  paging: (req: Request, res: Response) => Promise<any>;
  create: (req: Request, res: Response) => Promise<any>;
  update: (req: Request, res: Response) => Promise<any>;
}

export interface IAuthorizationServiceFunctions {
  login: (req: Request, res: Response) => any;
  token: (req: Request, res: Response) => any;
  logout: (req: Request, res: Response) => any;
}

export interface IUserService
  extends IService,
    IGenericServiceFunctions,
    IAuthorizationServiceFunctions {}

interface IServicePopulation {
  getPopulatedById(req: Request, res: Response): Promise<any>;
}

export interface IPersonService
  extends IService,
    IGenericServiceFunctions,
    IServicePopulation {
  addCat(req: Request, res: Response): Promise<any>;
}

export interface IHouseService
  extends IService,
    IGenericServiceFunctions,
    IServicePopulation {
  addPerson(req: Request, res: Response): Promise<any>;
}

export interface IUserService extends IService, IGenericServiceFunctions {
  login(req: Request, res: Response): Promise<any>;
}

export interface IGraphQLService {
  repository?: IRepository;
  // getAllCats: () => Promise<any>;
  // getCatById: (id: string) => Promise<any>;
  // getPersonById: (id: string) => Promise<any>;
  // getAllPeople: () => Promise<any>;
  // createCat: (cat: ICat) => Promise<any>;
  // getPersonPopulatedById: (id: string) => Promise<any>;
  // getPopulatedByAnimalId: (id: string) => Promise<any>;
  RootQueryType: GraphQLObjectType;
  RootMutationType: GraphQLObjectType;
}
