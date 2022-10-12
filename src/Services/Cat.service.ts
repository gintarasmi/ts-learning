import { Request, Response } from 'express';
import { ICatModel } from '../Models/Cat.model';
import { GenericService } from './Generic.service';
import { eventEmitter, Events } from '../Utils/GlobalEventEmitter';
import { ICatRepository } from '../Types/Repository.type';

export class CatService extends GenericService {
  constructor(public repository: ICatRepository) {
    super();
  }
  getById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const model = await this.repository.getById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      const givenName = model.givenName;
      eventEmitter.emit(Events.CAT_GETTING, { cat: givenName });
      return res.status(200).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  create = async (req: Request, res: Response) => {
    try {
      const model = await this.repository.create(req.body as ICatModel);
      const givenName = model.givenName;
      eventEmitter.emit(Events.CAT_CREATING, { model: givenName });
      return res.status(201).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  update = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const model = await this.repository.getById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      const updatedModel = await this.repository.update(
        model,
        req.body as ICatModel
      );
      return res.status(201).json({ updatedModel });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
