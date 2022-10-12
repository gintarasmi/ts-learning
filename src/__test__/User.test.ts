import supertest from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import { application } from '../CreateApp';
import { UserRepository } from '../Repository/User.repository';
import { AuthenticationFunctions } from '../Utils/AuthenticationFunctions';

const user = {
  email: 'g@g.com',
  password: 'password'
};
const badUserToCreate = {
  email: 'g@g',
  password: 'password'
};
const userCreated = {
  _id: '6321f18f459a76314f88710a',
  email: 'g@g.com',
  password: '$2b$10$t2gWneVE.570HOg0gw3jkeDp8BsicMzZan7zrLnCh8RT7KU.GBOGO'
};

describe('user', () => {
  describe('create', () => {
    describe('given valid input', () => {
      it('should return 201 and new user', async () => {
        const getUserRepositoryMock = jest
          .spyOn(UserRepository.prototype, 'create')
          //@ts-ignore
          .mockImplementation(() => {
            return userCreated;
          });
        const { body, statusCode } = await supertest(application.app)
          .post(`/user/create`)
          .send(user);
        expect(statusCode).toBe(201);
        expect(body.model.email).toBe(user.email);
      });
    });

    describe('given invalid input', () => {
      it('should not pass validation and return 400', async () => {
        const getUserRepositoryMock = jest.spyOn(
          UserRepository.prototype,
          'create'
        );
        //@ts-ignore
        const { body, statusCode } = await supertest(application.app)
          .post(`/user/create`)
          .send(badUserToCreate);
        expect(statusCode).toBe(400);
        expect(getUserRepositoryMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('login', () => {
    describe('given non matching passwords', () => {
      it('returns 401', async () => {
        const createAccessTokenMock = jest.spyOn(
          AuthenticationFunctions.prototype,
          'createAccessToken'
        );
        const getByEmailMock = jest
          .spyOn(UserRepository.prototype, 'getByEmail')
          //@ts-ignore
          .mockImplementation(() => {
            return userCreated;
          });
        const { body, statusCode } = await supertest(application.app)
          .get(`/user/login`)
          .send({
            email: 'g@g.com',
            password: 'incorrectPassword'
          });
        expect(statusCode).toBe(401);
        expect(createAccessTokenMock).not.toHaveBeenCalled();
      });
    });

    describe('given not created user', () => {
      it('returns 404', async () => {
        const createAccessTokenMock = jest.spyOn(
          AuthenticationFunctions.prototype,
          'createAccessToken'
        );
        const getByEmailMock = jest
          .spyOn(UserRepository.prototype, 'getByEmail')
          //@ts-ignore
          .mockImplementation(() => {
            return null;
          });
        const { body, statusCode } = await supertest(application.app)
          .get(`/user/login`)
          .send(user);
        expect(statusCode).toBe(404);
        expect(createAccessTokenMock).not.toHaveBeenCalled();
      });
    });

    describe('given correct user', () => {
      it('returns 200', async () => {
        const addToRedisMock = jest
          .spyOn(AuthenticationFunctions.prototype, 'addToCache')
          .mockImplementation(async (key: string, value: string) => {});
        const getByEmailMock = jest
          .spyOn(UserRepository.prototype, 'getByEmail')
          //@ts-ignore
          .mockImplementation(() => {
            return userCreated;
          });
        const { body, statusCode } = await supertest(application.app)
          .get(`/user/login`)
          .send(user);
        expect(statusCode).toBe(200);
        expect(addToRedisMock).toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    describe('given token', () => {
      it('returns 200', async () => {
        const accessToken = jsonwebtoken.sign({ email: user.email }, 'test');
        const deleteFromRedisMock = jest
          .spyOn(AuthenticationFunctions.prototype, 'deleteFromCache')
          //@ts-ignore
          .mockImplementation(() => {
            return accessToken;
          });
        const { body, statusCode } = await supertest(application.app)
          .delete(`/user/logout`)
          .send({ token: accessToken });
        expect(statusCode).toBe(200);
      });
    });

    describe('given no token', () => {
      it('returns 401', async () => {
        const deleteFromRedisMock = jest.spyOn(
          AuthenticationFunctions.prototype,
          'deleteFromCache'
        );
        const { body, statusCode } = await supertest(application.app)
          .delete(`/user/logout`)
          .send('');
        expect(statusCode).toBe(401);
        expect(deleteFromRedisMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('token', () => {
    describe('given good token', () => {
      it('returns 200', async () => {
        const accessToken = jsonwebtoken.sign({ email: user.email }, 'test');
        const getMembersFromRedisMock = jest
          .spyOn(AuthenticationFunctions.prototype, 'getMembersFromCache')
          //@ts-ignore
          .mockImplementation(() => {
            return [accessToken];
          });
        const { body, statusCode } = await supertest(application.app)
          .post(`/user/token`)
          .send({ token: accessToken });
        expect(statusCode).toBe(200);
      });
    });

    describe('given bad token', () => {
      it('returns 403', async () => {
        const accessToken = jsonwebtoken.sign({ email: user.email }, 'test');
        const getMembersFromRedisMock = jest
          .spyOn(AuthenticationFunctions.prototype, 'getMembersFromCache')
          //@ts-ignore
          .mockImplementation(() => {
            return ['diffrent token'];
          });
        const { body, statusCode } = await supertest(application.app)
          .post(`/user/token`)
          .send({ token: accessToken });
        expect(statusCode).toBe(403);
      });
    });

    describe('given no token', () => {
      it('returns 401', async () => {
        const getMembersFromRedisMock = jest.spyOn(
          AuthenticationFunctions.prototype,
          'getMembersFromCache'
        );
        const { body, statusCode } = await supertest(application.app)
          .post(`/user/token`)
          .send('');
        expect(statusCode).toBe(401);
        expect(getMembersFromRedisMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('getAll with token validation', () => {
    describe('given correct token', () => {
      it('retruns 200 and all users', async () => {
        const accessToken = jsonwebtoken.sign({ email: user.email }, 'test');
        const getAllMock = jest
          .spyOn(UserRepository.prototype, 'getAll')
          //@ts-ignore
          .mockImplementation(() => {
            return userCreated;
          });
        const { body, statusCode } = await supertest(application.app)
          .get(`/user/getAll`)
          .set('Authorization', 'bearer ' + accessToken);
        expect(statusCode).toBe(200);
      });
    });
  });
});
