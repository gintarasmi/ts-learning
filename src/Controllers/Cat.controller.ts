import express from 'express';
import { IService, IGenericServiceFunctions } from '../Types/Service.type';
import ValidateRequest from '../Middleware/ValidateRequest';
import { catSchema } from '../Utils/Schemas';
import IController from '../Types/Controller.type';

export default class CatController implements IController {
  path: string = '/cat';
  router: express.Router = express.Router();

  constructor(public service: IService & IGenericServiceFunctions) {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.patch(`${this.path}/restore/:id`, this.service.restoreDeleted);
    this.router.delete(`${this.path}/delete/:id`, this.service.delete);
    this.router.get(`${this.path}/getAll`, this.service.getAll);
    this.router.get(`${this.path}/get/:id`, this.service.getById);
    this.router.get(
      `${this.path}/page/:pageNumber/:perPage`,
      this.service.paging
    );
    this.router.patch(
      `${this.path}/update/:id`,
      ValidateRequest(catSchema),
      this.service.update
    );
    this.router.post(
      `${this.path}/create`,
      ValidateRequest(catSchema),
      this.service.create
    );
    this.router.get(`${this.path}/deleted`, this.service.getAllDeleted);
  }
}
