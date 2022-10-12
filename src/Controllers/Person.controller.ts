import express from 'express';
import ValidateRequest from '../Middleware/ValidateRequest';
import { personSchema } from '../Utils/Schemas';
import IController from '../Types/Controller.type';
import { IPersonService } from '../Types/Service.type';

export default class PersonController implements IController {
  path: string = '/person';
  router: express.Router = express.Router();

  constructor(public service: IPersonService) {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/getAll`, this.service.getAll);
    this.router.get(`${this.path}/get/:id`, this.service.getById);
    this.router.get(
      `${this.path}/page/:pageNumber/:perPage`,
      this.service.paging
    );
    this.router.patch(
      `${this.path}/update/:id`,
      ValidateRequest(personSchema),
      this.service.update
    );
    this.router.post(
      `${this.path}/create`,
      ValidateRequest(personSchema),
      this.service.create
    );
    this.router.patch(
      `${this.path}/addCat/:personId/:catId`,
      this.service.addCat
    );
    this.router.patch(`${this.path}/restore/:id`, this.service.restoreDeleted);
    this.router.delete(`${this.path}/delete/:id`, this.service.delete);
    this.router.get(`${this.path}/deleted`, this.service.getAllDeleted);
    this.router.get(
      `${this.path}/populated/:id`,
      this.service.getPopulatedById
    );
  }
}
