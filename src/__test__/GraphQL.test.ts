import supertest from 'supertest';
import gql from 'graphql-tag';
import { application } from '../CreateApp';
import { CatRepository } from '../Repository/Cat.repository';
import { PersonRepository } from '../Repository/Person.repository';

const cat = {
  _id: '631f847ff062e0325a796d16',
  givenName: 'Semas',
  age: 12,
  breed: 'Siamese',
  weight: 5,
  eyeColor: ['Blue'],
  updatedAt: '2022-09-20T13:44:32.491Z'
};
const catToCreate = {
  givenName: 'Semas',
  age: 12,
  breed: 'Siamese',
  weight: 5,
  eyeColor: 'Blue'
};
const person = {
  _id: '6321f18f459a76314f88710a',
  name: 'Gintaras'
};

jest.mock('../Repository/Cat.repository');

describe('graphQl', () => {
  describe('cat', () => {
    describe('get cat by id', () => {
      describe('given the cat does not exist', () => {
        it('should return 404 not found', async () => {
          const getCatServiceMock = jest
            .spyOn(CatRepository.prototype, 'getById')
            //@ts-ignore
            .mockImplementation(() => {
              return null;
            });
          const catId = 'string';
          const { body, statusCode } = await supertest(application.app)
            .post(`/graphql`)
            .send({
              query: `query {cat(id:\"${catId}\") { givenName } }`
            });
          expect(body.data.cat).toBe(null);
          expect(getCatServiceMock).toBeCalled();
        });
      });
      describe('given the cat exists', () => {
        it('should return 200 and cat', async () => {
          const getCatServiceMock = jest
            .spyOn(CatRepository.prototype, 'getById')
            //@ts-ignore
            .mockImplementation(() => {
              return cat;
            });
          const { body, statusCode } = await supertest(application.app)
            .post(`/graphql`)
            .send({
              query: `query {cat(id:\"${cat._id}\") { _id givenName } }`
            });
          expect(statusCode).toBe(200);
          expect(body.data.cat._id).toBe(cat._id);
          expect(getCatServiceMock).toBeCalled();
        });
      });
    });

    describe('create cat', () => {
      describe('given incorrect form', () => {
        it('validation should return 400', async () => {
          const getCatServiceMock = jest.spyOn(
            CatRepository.prototype,
            'create'
          );
          const badCat = { ...catToCreate };
          //@ts-ignore
          badCat.age = 'badAge';
          const { body, statusCode } = await supertest(application.app)
            .post(`/graphql`)
            .send({
              query: `mutation {addCat(givenName:\"${badCat.givenName}\", age:\"${badCat.age}\", breed:\"${badCat.breed}\", weight:\"${badCat.weight}\", eyeColor:\"${badCat.eyeColor}\" ){ givenName } }`
            });
          expect(statusCode).toBe(400);
          expect(getCatServiceMock).not.toHaveBeenCalled();
        });
      });
      describe('given correct form', () => {
        it('should return 200 and created cat', async () => {
          const getCatServiceMock = jest
            .spyOn(CatRepository.prototype, 'create')
            //@ts-ignore
            .mockImplementation(() => {
              return cat;
            });
          const query = {
            query: `mutation {addCat( givenName: \"${catToCreate.givenName}\" age: ${catToCreate.age} breed: \"${catToCreate.breed}\" weight: ${catToCreate.weight} eyeColor: \"${catToCreate.eyeColor}\" ){ givenName } }`
          };
          const { body, statusCode } = await supertest(application.app)
            .post(`/graphql`)
            .send(query);
          console.log(body);
          expect(statusCode).toBe(200);
          expect(body.data.addCat.givenName).toBe(catToCreate.givenName);
        });
      });
    });
  });

  describe('person', () => {
    describe('get person by id', () => {
      describe('given the person does not exist', () => {
        it('should return null', async () => {
          const getPersonServiceMock = jest
            .spyOn(PersonRepository.prototype, 'getById')
            //@ts-ignore
            .mockImplementation(() => {
              return null;
            });
          const personId = 'string';
          const { body, statusCode } = await supertest(application.app)
            .post(`/graphql`)
            .send({
              query: `query {person(id:\"${personId}\") { name } }`
            });
          expect(body.data.person).toBe(null);
          expect(getPersonServiceMock).toBeCalled();
        });
      });
      describe('given the person exists', () => {
        it('should return 200 and person', async () => {
          const getPersonServiceMock = jest
            .spyOn(PersonRepository.prototype, 'getById')
            //@ts-ignore
            .mockImplementation(() => {
              return person;
            });
          const { body, statusCode } = await supertest(application.app)
            .post(`/graphql`)
            .send({
              query: `query {person(id:\"${person._id}\") { _id name } }`
            });
          expect(statusCode).toBe(200);
          expect(body.data.person._id).toBe(person._id);
          expect(getPersonServiceMock).toBeCalled();
        });
      });
    });
  });
});
