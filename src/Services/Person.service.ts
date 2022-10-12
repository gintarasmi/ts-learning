import { Request, Response } from 'express';
import { IPersonModel } from '../Models/Person.model';
import { GenericService } from './Generic.service';
import { IPersonService } from '../Types/Service.type';
import { IPersonRepository } from '../Types/Repository.type';

export class PersonService extends GenericService implements IPersonService {
  constructor(public repository: IPersonRepository) {
    super();
  }

  create = async (req: Request, res: Response) => {
    try {
      const model = await this.repository.create(req.body as IPersonModel);
      return res.status(201).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  addCat = async (req: Request, res: Response) => {
    const catId = req.params.catId;
    const personId = req.params.personId;
    try {
      const cat = await this.repository.findCat(catId);
      if (!cat) return res.status(404).json({ message: 'Cat not found' });
      const person: IPersonModel = await this.repository.getById(personId);
      if (!person) return res.status(404).json({ message: 'Person not found' });
      if (person.animals.includes(cat._id))
        return res
          .status(400)
          .json({ message: 'Person already contains this cat' });
      const updatedPerson = await this.repository.addCat(person, cat._id);
      return res.status(201).json({ updatedPerson });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  //perkelt i generic
  getPopulatedById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const model = await this.repository.getPopulatedById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  update = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    if (!id) return res.status(400).json({ message: 'Id required' });
    try {
      const model = await this.repository.getById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      const updatedModel = await this.repository.update(
        model,
        req.body as IPersonModel
      );
      return res.status(201).json({ updatedModel });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
