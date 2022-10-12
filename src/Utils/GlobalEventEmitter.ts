import { EventEmitter } from 'events';

enum Events {
  USER_REGISTRATION = 'user-registered',
  CAT_GETTING = 'cat-getting',
  CAT_CREATING = 'cat-creating'
}
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };

//Note: Due to Node.jS Caching, this will always return the same instance of eventEmitter (Singleton)
