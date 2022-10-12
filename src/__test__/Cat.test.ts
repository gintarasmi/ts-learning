import supertest from 'supertest';
import { application } from '../CreateApp';
import { CatRepository } from '../Repository/Cat.repository';
import RoutesLogging from '../Middleware/RoutesLogging';

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
        const catId = 1;
        await supertest(application.app).get(`/cat/get/${catId}`).expect(404);
      });
    });
    describe('given the exists', () => {
      it('should return 200 and cat', async () => {
        const getCatServiceMock = jest
          .spyOn(CatRepository.prototype, 'getById')
          //@ts-ignore
          .mockImplementation(() => {
            return cat;
          });
        const { body, statusCode } = await supertest(application.app).get(
          `/cat/get/${cat._id}`
        );
        //console.log(body);
        expect(statusCode).toBe(200);
        expect(body.model._id).toBe(cat._id);
      });
    });
  });
  describe('create cat', () => {
    describe('given incorrect form', () => {
      it('validation should return 400', async () => {
        const getCatServiceMock = jest.spyOn(CatRepository.prototype, 'create');
        const badCat = { ...catToCreate };
        //@ts-ignore
        badCat.age = 'badAge';
        const { body, statusCode } = await supertest(application.app)
          .post(`/cat/create`)
          .send(badCat);
        expect(statusCode).toBe(400);
        expect(getCatServiceMock).not.toHaveBeenCalled();
      });
    });
    describe('given correct form', () => {
      it('should return 201 and created cat', async () => {
        const getCatServiceMock = jest
          .spyOn(CatRepository.prototype, 'create')
          //@ts-ignore
          .mockImplementation(() => {
            return cat;
          });
        const { body, statusCode } = await supertest(application.app)
          .post(`/cat/create`)
          .send(catToCreate);

        expect(statusCode).toBe(201);
        expect(body.model.givenName).toBe(catToCreate.givenName);
      });
    });
  });
});
