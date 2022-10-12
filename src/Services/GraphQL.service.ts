import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql';
import { IGraphQLService } from '../Types/Service.type';
import {
  ICatRepository,
  IGenericRepositoryFunctions,
  IHouseRepository,
  IPersonRepository,
  IUserRepository
} from '../Types/Repository.type';
import { ICatModel } from '../Models/Cat.model';
import { IPersonModel } from '../Models/Person.model';
import { IHouseModel } from '../Models/House.model';
import { IAuthenticationFunctions } from 'Types/AuthenticationFunctions';
import { IUserModel } from '../Models/User.model';
import Logging from '../Utils/Logging';

export class GraphQLService implements IGraphQLService {
  constructor(
    public catRepository: ICatRepository,
    public personRepository: IPersonRepository,
    public houseRepository: IHouseRepository,
    public userRepository: IUserRepository,
    public auth: IAuthenticationFunctions
  ) {}

  getAll(
    model: GraphQLObjectType,
    repository: IGenericRepositoryFunctions,
    desc: string
  ) {
    return {
      type: new GraphQLList(model),
      description: desc,
      resolve: async () => {
        try {
          return await repository.getAll();
        } catch (error) {
          return error;
        }
      }
    };
  }
  getAllDeleted(
    model: GraphQLObjectType,
    repository: IGenericRepositoryFunctions,
    desc: string
  ) {
    return {
      type: new GraphQLList(model),
      description: desc,
      resolve: async () => {
        try {
          return await repository.getAllDeleted();
        } catch (error) {
          return error;
        }
      }
    };
  }
  getById(
    model: GraphQLObjectType,
    repository: IGenericRepositoryFunctions,
    desc: string
  ) {
    return {
      type: model,
      description: desc,
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parent: any, args: any) => {
        try {
          return repository.getById(args.id);
        } catch (error) {
          return error;
        }
      }
    };
  }
  paging(
    model: GraphQLObjectType,
    repository: IGenericRepositoryFunctions,
    desc: string
  ) {
    return {
      type: new GraphQLList(model),
      description: desc,
      args: {
        first: { type: GraphQLNonNull(GraphQLInt) },
        offset: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent: any, args: any) => {
        try {
          if (args.first < 1 || args.offset < 0) return 'Invalid arguments';
          return await repository.pagingOffset(args.first, args.offset);
        } catch (error) {
          return error;
        }
      }
    };
  }

  PersonType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Person',
    description: 'Human being',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString) },
      age: { type: GraphQLNonNull(GraphQLInt) },
      cats: {
        type: GraphQLList(this.CatType),
        resolve: async (person) => {
          try {
            const personWithAnimals =
              await this.personRepository.getPopulatedById(person._id);
            return personWithAnimals.animals;
          } catch (error) {
            return error;
          }
        }
      }
    })
  });

  CatType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Cat',
    description: 'An animal that is a cat',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      givenName: { type: GraphQLNonNull(GraphQLString) },
      age: { type: GraphQLNonNull(GraphQLInt) },
      breed: { type: GraphQLNonNull(GraphQLString) },
      weight: { type: GraphQLNonNull(GraphQLInt) },
      eyeColor: { type: GraphQLList(GraphQLString) },
      owners: {
        type: GraphQLList(this.PersonType),
        resolve: async (cat) => {
          try {
            return await this.personRepository.getPeopleThatContainAnimalId(
              cat._id
            );
          } catch (error) {
            return error;
          }
        }
      }
    })
  });

  AddressType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Address',
    description: 'Defines where a house is',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      city: { type: GraphQLNonNull(GraphQLString) },
      street: { type: GraphQLNonNull(GraphQLString) },
      houseNumber: { type: GraphQLNonNull(GraphQLString) },
      flatNumber: { type: GraphQLString }
    })
  });

  UserType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    description: 'User with email and password',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) }
    })
  });

  TokensType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Jwt tokens',
    description: 'Access and refresh tokens',
    fields: () => ({
      accessToken: { type: GraphQLString },
      refreshToken: { type: GraphQLString }
    })
  });

  HouseType: GraphQLObjectType = new GraphQLObjectType({
    name: 'House',
    description: 'A place where people live',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      address: { type: this.AddressType },
      people: {
        type: GraphQLList(this.PersonType),
        resolve: async (house) => {
          try {
            return await this.houseRepository.getPopulatedById(house._id);
          } catch (error) {
            return error;
          }
        }
      }
    })
  });

  RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      cat: this.getById(this.CatType, this.catRepository, 'A cat'),
      cats: this.getAll(this.CatType, this.catRepository, 'A list of cats'),
      catsPaging: this.paging(
        this.CatType,
        this.catRepository,
        'A list of cats with paging'
      ),
      user: this.getById(this.UserType, this.userRepository, 'A user'),
      users: this.getAll(this.UserType, this.userRepository, 'A list of users'),
      usersPaging: this.paging(
        this.UserType,
        this.userRepository,
        'A list of users with paging'
      ),
      person: this.getById(this.PersonType, this.personRepository, 'A person'),
      people: this.getAll(
        this.PersonType,
        this.personRepository,
        'A list of people'
      ),
      peoplePaging: this.paging(
        this.PersonType,
        this.personRepository,
        'A list of people with paging'
      ),
      house: this.getById(this.HouseType, this.houseRepository, 'A house'),
      houses: this.getAll(
        this.HouseType,
        this.houseRepository,
        'A list of houses'
      ),
      housesPaging: this.paging(
        this.HouseType,
        this.houseRepository,
        'A list of houses with paging'
      ),
      catsDeleted: this.getAllDeleted(
        this.CatType,
        this.catRepository,
        'A list of deleted cats'
      ),
      peopleDeleted: this.getAllDeleted(
        this.PersonType,
        this.personRepository,
        'A list of deleted people'
      ),
      housesDeleted: this.getAllDeleted(
        this.HouseType,
        this.houseRepository,
        'A list of deleted houses'
      ),
      usersDeleted: this.getAllDeleted(
        this.UserType,
        this.userRepository,
        'A list of deleted users'
      )
    })
  });

  RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
      addCat: {
        type: this.CatType,
        description: 'Add cat',
        args: {
          givenName: { type: GraphQLNonNull(GraphQLString) },
          age: { type: GraphQLNonNull(GraphQLInt) },
          breed: { type: GraphQLNonNull(GraphQLString) },
          weight: { type: GraphQLNonNull(GraphQLInt) },
          eyeColor: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            return this.catRepository.create({
              givenName: args.givenName,
              age: args.age,
              breed: args.breed,
              weight: args.weight,
              eyeColor: args.eyeColor
            } as ICatModel);
          } catch (error) {
            return error;
          }
        }
      },
      addPerson: {
        type: this.PersonType,
        description: 'Add person',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          age: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (parent, args) => {
          try {
            return this.personRepository.create({
              name: args.name,
              age: args.age
            } as IPersonModel);
          } catch (error) {
            return error;
          }
        }
      },
      addUser: {
        type: this.UserType,
        description: 'Add user',
        args: {
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (parent, args) => {
          const hashedPassword = await this.auth.hashPassword(args.password);
          const user = { email: args.email, password: hashedPassword };
          try {
            return await this.userRepository.create(user as IUserModel);
          } catch (error) {
            return error;
          }
        }
      },
      addHouse: {
        type: this.HouseType,
        description: 'Add house',
        args: {
          city: { type: GraphQLNonNull(GraphQLString) },
          street: { type: GraphQLNonNull(GraphQLString) },
          houseNumber: { type: GraphQLNonNull(GraphQLString) },
          flatNumber: { type: GraphQLString }
        },
        resolve: async (parent, args) => {
          const house = {
            address: {
              city: args.city,
              street: args.street,
              houseNumber: args.houseNumber,
              flatNumber: args.flatNumber
            },
            people: null
          } as unknown;
          try {
            return await this.houseRepository.create(house as IHouseModel);
          } catch (error) {
            return error;
          }
        }
      },
      updateCat: {
        type: this.CatType,
        description: 'Update cat',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) },
          givenName: { type: GraphQLNonNull(GraphQLString) },
          age: { type: GraphQLNonNull(GraphQLInt) },
          breed: { type: GraphQLNonNull(GraphQLString) },
          weight: { type: GraphQLNonNull(GraphQLInt) },
          eyeColor: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel: ICatModel = await this.catRepository.getById(
              args.id
            );
            if (!existingModel) return 'model not found';
            return this.catRepository.update(existingModel, {
              givenName: args.givenName,
              age: args.age,
              breed: args.breed,
              weight: args.weight,
              eyeColor: args.eyeColor
            } as ICatModel);
          } catch (error) {
            return error;
          }
        }
      },
      updatePerson: {
        type: this.PersonType,
        description: 'Update person',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) },
          name: { type: GraphQLNonNull(GraphQLString) },
          age: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel: IPersonModel =
              await this.personRepository.getById(args.id);
            if (!existingModel) return 'model not found';
            return this.personRepository.update(existingModel, {
              name: args.name,
              age: args.age
            } as IPersonModel);
          } catch (error) {
            return error;
          }
        }
      },
      updateUser: {
        type: this.UserType,
        description: 'Update user',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel: IUserModel = await this.userRepository.getById(
              args.id
            );
            if (!existingModel) return 'model not found';
            const hashedPassword = await this.auth.hashPassword(args.password);
            const user = {
              email: args.email,
              password: hashedPassword
            };
            return await this.userRepository.update(
              existingModel,
              user as IUserModel
            );
          } catch (error) {
            return error;
          }
        }
      },
      updateHouse: {
        type: this.HouseType,
        description: 'Update house',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) },
          city: { type: GraphQLNonNull(GraphQLString) },
          street: { type: GraphQLNonNull(GraphQLString) },
          houseNumber: { type: GraphQLNonNull(GraphQLString) },
          flatNumber: { type: GraphQLString }
        },
        resolve: async (parent, args) => {
          const house = {
            address: {
              city: args.city,
              street: args.street,
              houseNumber: args.houseNumber,
              flatNumber: args.flatNumber
            }
          } as unknown;
          try {
            const existingModel: IHouseModel =
              await this.houseRepository.getById(args.id);
            if (!existingModel) return 'model not found';
            return await this.houseRepository.update(
              existingModel,
              house as IHouseModel
            );
          } catch (error) {
            return error;
          }
        }
      },
      deleteCat: {
        type: this.CatType,
        description: 'Delete cat',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel = await this.catRepository.getById(args.id);
            if (!existingModel) return 'model not found';
            return this.catRepository.delete(existingModel);
          } catch (error) {
            return error;
          }
        }
      },
      deletePerson: {
        type: this.PersonType,
        description: 'Delete person',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel = await this.personRepository.getById(args.id);
            if (!existingModel) return 'model not found';
            return this.personRepository.delete(existingModel);
          } catch (error) {
            return error;
          }
        }
      },
      deleteUser: {
        type: this.UserType,
        description: 'Delete user',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel = await this.userRepository.getById(args.id);
            if (!existingModel) return 'model not found';
            return await this.userRepository.delete(existingModel);
          } catch (error) {
            return error;
          }
        }
      },
      deleteHouse: {
        type: this.HouseType,
        description: 'Delete house',
        args: {
          id: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const existingModel = await this.houseRepository.getById(args.id);
            if (!existingModel) return 'model not found';
            return await this.houseRepository.delete(existingModel);
          } catch (error) {
            return error;
          }
        }
      },
      addCatToPerson: {
        type: this.PersonType,
        description: 'Add a cat to person',
        args: {
          catId: { type: GraphQLNonNull(GraphQLString) },
          personId: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const cat = await this.personRepository.findCat(args.catId);
            if (!cat) return 'Cat not found';
            const person = await this.personRepository.getById(args.personId);
            if (!person) return 'Person not found';
            if (person.animals.includes(cat._id))
              return 'Person already contains this cat';
            const updatedPerson = await this.personRepository.addCat(
              person,
              cat._id
            );
            return updatedPerson;
          } catch (error) {
            return error;
          }
        }
      },
      addPersonToHouse: {
        type: this.HouseType,
        description: 'Add a person to House',
        args: {
          personId: { type: GraphQLNonNull(GraphQLString) },
          houseId: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args) => {
          try {
            const person = await this.houseRepository.findPerson(args.personId);
            if (!person) return 'Person not found';
            const house = await this.houseRepository.getById(args.houseId);
            if (!house) return 'House not found';
            if (house.people.includes(person._id))
              return 'House already contains this person';
            const updatedHouse = await this.houseRepository.addPerson(
              house,
              person._id
            );
            return updatedHouse;
          } catch (error) {
            return error;
          }
        }
      }
      // login: {
      //   type: this.TokensType,
      //   description: 'Login and get tokens',
      //   args: {
      //     email: { type: GraphQLNonNull(GraphQLString) },
      //     password: { type: GraphQLNonNull(GraphQLString) }
      //   },
      //   resolve: async (parent, args) => {
      //     try {
      //       const model = await this.userRepository.getByEmail(args.email);
      //       if (!model) return 'User not found';
      //       const doPasswordsMatch = await this.auth.comparePasswords(
      //         args.password,
      //         model.password
      //       );
      //       if (!doPasswordsMatch) return 'wrong pass';

      //       const tokens = await this.auth.createTokens(args.email);
      //       console.log(tokens);
      //       return tokens;
      //     } catch (e) {
      //       Logging.error(e);
      //       return e;
      //     }
      //   }
      // }
    })
  });
}
