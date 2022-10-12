import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

import { eventEmitter, Events } from './Utils/GlobalEventEmitter';
import type { IApp } from './Types/App.type';
import type Controller from './Types/Controller.type';
import routesLogging from './Middleware/RoutesLogging';
import { config } from './Utils/Config';
import Logging from './Utils/Logging';
import FakeEmailer from './Utils/FakeEmailer';

export default class App implements IApp {
  public app: express.Application;
  public io: Server;
  public server: http.Server;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);

    this.initializeSocketEvents();
    new FakeEmailer();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeEvents();
  }

  public async listen() {
    this.server.listen(config.server.port, function () {
      Logging.info(`Running on port ${config.server.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(routesLogging);
  }

  private initializeControllers(controllers: Controller[]) {
    this.app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });
    this.app.get('/socketServer.js', (req, res) => {
      res.sendFile(__dirname + '/socketServer.js');
    });

    this.app //healthcheck
      .get('/ping', function (req, res) {
        res.status(200).json({ message: 'Hello world' });
      });

    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });

    //route not found
    this.app.use((req, res) => {
      const error = new Error('route not found');
      Logging.error(error);

      return res.status(404).json({ message: error.message });
    });
  }

  private initializeEvents() {
    eventEmitter.on(Events.CAT_CREATING, ({ cat }) => {
      this.io.emit('new cat', cat);
    });
  }
  private initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      socket.emit('getCats');
      console.log('a user connected');
    });
  }
}
