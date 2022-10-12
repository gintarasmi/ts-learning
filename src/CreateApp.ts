import App from './Bootstrap';
import CatController from './Controllers/Cat.controller';
import PersonController from './Controllers/Person.controller';
import HouseController from './Controllers/House.controller';
import { CatService } from './Services/Cat.service';
import { PersonService } from './Services/Person.service';
import { HouseService } from './Services/House.service';
import WeatherController from './Controllers/Weather.controller';
import RepositoryFactory from './Repository/RepositoryFactory';
import UserController from './Controllers/User.controller';
import GraphQLController from './Controllers/GraphQL.controller';
import { UserService } from './Services/User.service';
import { WeatherService } from './Services/Weather.service';
import { GraphQLService } from './Services/GraphQL.service';
import { AuthenticationFunctions } from './Utils/AuthenticationFunctions';
import {
  ICatRepository,
  IHouseRepository,
  IPersonRepository,
  IUserRepository
} from './Types/Repository.type';

const catRepository = RepositoryFactory.getRepository('Cat') as ICatRepository; //factory method pattern
const personRepository = RepositoryFactory.getRepository(
  'Person'
) as IPersonRepository;
const houseRepository = RepositoryFactory.getRepository(
  'House'
) as IHouseRepository;
const userRepository = RepositoryFactory.getRepository(
  'User'
) as IUserRepository;
const auth = new AuthenticationFunctions();
export const application = new App([
  new CatController(new CatService(catRepository)),
  new PersonController(new PersonService(personRepository)),
  new HouseController(new HouseService(houseRepository)),
  new WeatherController(new WeatherService()),
  new UserController(new UserService(userRepository, auth)),
  new GraphQLController(
    new GraphQLService(
      catRepository,
      personRepository,
      houseRepository,
      userRepository,
      auth
    )
  )
]);
