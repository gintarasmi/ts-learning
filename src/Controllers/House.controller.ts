import express from 'express';
import IController from '../Types/Controller.type';
import { IHouseService } from '../Types/Service.type';
import ValidateRequest from '../Middleware/ValidateRequest';
import { houseSchema } from '../Utils/Schemas';

export default class HouseController implements IController {
  path: string = '/house';
  router: express.Router = express.Router();

  constructor(public service: IHouseService) {
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
      ValidateRequest(houseSchema),
      this.service.update
    );
    this.router.post(
      `${this.path}/create`,
      ValidateRequest(houseSchema),
      this.service.create
    );
    this.router.patch(
      `${this.path}/addPerson/:houseId/:personId`,
      this.service.addPerson
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
