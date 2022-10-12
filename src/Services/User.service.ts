import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { GenericService } from './Generic.service';
import { IAuthorizationServiceFunctions } from '../Types/Service.type';
import { config } from '../Utils/Config';
import Logging from '../Utils/Logging';
import { IUserRepository } from '../Types/Repository.type';
import { IUserModel } from '../Models/User.model';
import { IAuthenticationFunctions } from '../Types/AuthenticationFunctions';

export class UserService
  extends GenericService
  implements IAuthorizationServiceFunctions
{
  constructor(
    public repository: IUserRepository,
    public auth: IAuthenticationFunctions
  ) {
    super();
  }
  create = async (req: Request, res: Response) => {
    const hashedPassword = await this.auth.hashPassword(req.body.password);
    const user = { email: req.body.email, password: hashedPassword };
    try {
      const model = await this.repository.create(user as IUserModel);
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
      const updatedModel = await this.repository.update(model, req.body);
      return res.status(201).json({ model });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const model = await this.repository.getByEmail(email);
      if (!model) return res.status(404).json('User not found');
      const doPasswordsMatch = await this.auth.comparePasswords(
        password,
        model.password
      );
      if (!doPasswordsMatch) return res.status(401).json('wrong pass');

      const tokens = await this.auth.createTokens(email);

      return res.status(200).json(tokens);
    } catch (e) {
      Logging.error(e);
      return res.status(500).json();
    }
  };

  logout = async (req: Request, res: Response) => {
    const token = req.body.token;
    if (token == null) return res.status(401).json('Need refresh token');
    try {
      this.auth.deleteFromCache('refreshTokens', token);
      return res.status(200).json('Logout successful');
    } catch (error) {
      return res.status(500).json();
    }
  };

  token = async (req: Request, res: Response) => {
    const token = req.body.token;
    if (token == null) return res.status(401).json('Need refresh token');
    try {
      const refreshTokens = await this.auth.getMembersFromCache(
        'refreshTokens'
      );
      if (!refreshTokens.includes(token))
        return res.status(403).json('Incorrect token');
      jsonwebtoken.verify(
        token,
        config.secret.refresh,
        (err: VerifyErrors | null, user: any) => {
          if (err) return res.status(403).json('Incorrect token');
          const { email, iat }: { email: string; iat: number } = user;
          const accessToken = this.auth.createAccessToken(email);
          return res.status(200).json({ accessToken: accessToken });
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
