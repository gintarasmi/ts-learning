import { Request, Response } from 'express';
import { IHouseModel } from '../Models/House.model';
import { GenericService } from './Generic.service';
import { IHouseService } from '../Types/Service.type';
import { IHouseRepository } from '../Types/Repository.type';

export class HouseService extends GenericService implements IHouseService {
  constructor(public repository: IHouseRepository) {
    super();
  }

  create = async (req: Request, res: Response) => {
    try {
      const model = await this.repository.create(req.body as IHouseModel);
      return res.status(201).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  addPerson = async (req: Request, res: Response) => {
    const houseId = req.params.houseId;
    const personId = req.params.personId;
    try {
      const person = await this.repository.findPerson(personId);
      if (!person) return res.status(404).json({ message: 'Person not found' });
      const house: IHouseModel = await this.repository.getById(houseId);
      if (!house) return res.status(404).json({ message: 'House not found' });
      if (house.people.includes(person._id))
        return res
          .status(400)
          .json({ message: 'House already contains this person' });
      const updatedHouse = await this.repository.addPerson(house, person._id);
      // await this.repository.addHouseToPerson(house._id, person);
      return res.status(201).json({ updatedHouse });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

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
    try {
      const model = await this.repository.getById(id);
      if (!model) return res.status(404).json({ message: 'Not found' });
      const updatedModel = await this.repository.update(
        model,
        req.body as IHouseModel
      );
      return res.status(201).json({ updatedModel });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
