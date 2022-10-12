import express from 'express';
import { IService } from '../Types/Service.type';
import IController from '../Types/Controller.type';

export default class WeatherController implements IController {
  path: string = '/weather';
  router: express.Router = express.Router();

  constructor(public service: IService) {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/info/:city`, this.service.getById);
  }
}
