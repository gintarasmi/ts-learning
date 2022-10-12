import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      return res.status(400).send(message);
    }
  };

export default validate;
