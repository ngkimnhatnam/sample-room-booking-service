import eventEmitter from 'events';
import('./logging');
import('./emailing');

const events = new eventEmitter.EventEmitter();

export default events;