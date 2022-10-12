import express from 'express';
import ValidateRequest from '../Middleware/ValidateRequest';
import TokenValidation from '../Middleware/TokenValidation';
import { userSchema } from '../Utils/Schemas';
import IController from '../Types/Controller.type';
import { IUserService } from '../Types/Service.type';

export default class UserController implements IController {
  path: string = '/user';
  router: express.Router = express.Router();

  constructor(public service: IUserService) {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.patch(`${this.path}/restore/:id`, this.service.restoreDeleted);
    this.router.delete(`${this.path}/delete/:id`, this.service.delete);
    this.router.get(
      `${this.path}/getAll`,
      TokenValidation(),
      this.service.getAll
    );
    this.router.get(`${this.path}/get/:id`, this.service.getById);
    this.router.get(
      `${this.path}/login`,
      ValidateRequest(userSchema),
      this.service.login
    );
    this.router.post(`${this.path}/token`, this.service.token);
    this.router.delete(`${this.path}/logout`, this.service.logout);
    this.router.get(
      `${this.path}/page/:pageNumber/:perPage`,
      this.service.paging
    );
    this.router.patch(
      `${this.path}/update/:id`,
      ValidateRequest(userSchema),
      this.service.update
    );
    this.router.post(
      `${this.path}/create`,
      ValidateRequest(userSchema),
      this.service.create
    );
    this.router.get(`${this.path}/deleted`, this.service.getAllDeleted);
  }
}
