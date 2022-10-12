import { eventEmitter, Events } from './GlobalEventEmitter';
import Logging from './Logging';

class FakeEmailer {
  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    eventEmitter.on(Events.CAT_GETTING, ({ cat }) => {
      Logging.info(`Emailing ${cat}`);
    });
  }
}

export default FakeEmailer;
