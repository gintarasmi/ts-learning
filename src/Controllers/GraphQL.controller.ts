import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { IGraphQLService } from '../Types/Service.type';
import IController from '../Types/Controller.type';

export default class GraphQLController implements IController {
  path: string = '/graphql';
  router: express.Router = express.Router();
  schema: GraphQLSchema;

  constructor(public service: IGraphQLService) {
    this.schema = new GraphQLSchema({
      query: this.service.RootQueryType,
      mutation: this.service.RootMutationType
    });
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(
      `${this.path}`,
      graphqlHTTP({
        graphiql: true,
        schema: this.schema
      })
    );
  }
}
