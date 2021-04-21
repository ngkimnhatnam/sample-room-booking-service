import event from './eventEmitter';
import logger from '../configs/logger'

event.on('some-event-to-log', (payload) => {
  const info = {
    level: 'info',
    subject: 'Event subject',
    message: `${payload}`
  }
  logger(info)
})