import { CatRepository } from './Cat.repository';
import { HouseRepository } from './House.repository';
import { PersonRepository } from './Person.repository';
import { UserRepository } from './User.repository';

export default class RepositoryFactory {
  static getRepository(repository: string) {
    switch (repository) {
      case 'Cat': {
        return new CatRepository();
        break;
      }
      case 'Person': {
        return new PersonRepository();
        break;
      }
      case 'User': {
        return new UserRepository();
        break;
      }
      default: {
        return new HouseRepository();
        break;
      }
    }
  }
}
