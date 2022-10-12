import { Request, Response, Router } from 'express';
import { GenericRepository } from 'Repository/Generic.repository';
import { IService, IGenericServiceFunctions } from '../Types/Service.type';

export abstract class GenericService
  implements IService, IGenericServiceFunctions
{
  abstract repository: GenericRepository;
  getAll = async (req: Request, res: Response) => {
    try {
      const model = await this.repository.getAll();
      return res.status(200).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  getById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const model = await this.repository.getById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  delete = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const model = await this.repository.getById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      await this.repository.delete(model);
      return res.status(201).json({ message: 'Model deleted' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  getAllDeleted = async (req: Request, res: Response) => {
    try {
      const model = await this.repository.getAllDeleted();
      return res.status(200).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  restoreDeleted = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const model = await this.repository.getByIdDeleted(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      const restoredModel = await this.repository.restoreDeleted(model);
      return res.status(201).json({ restoredModel });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  //sort skip limit
  paging = async (req: Request, res: Response) => {
    const pageSize = parseInt(`${req.params.perPage}`, 10) || 1;
    const pageNumber = parseInt(`${req.params.pageNumber}`, 10) || 1;
    if (pageNumber < 1 || pageSize < 1)
      return res
        .status(400)
        .json('PageNumber and pageSize must be more than 0');
    try {
      const model = await this.repository.paging(pageNumber, pageSize);
      return res.status(200).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  abstract create: (req: Request, res: Response) => Promise<any>;
  abstract update: (req: Request, res: Response) => Promise<any>;
}
