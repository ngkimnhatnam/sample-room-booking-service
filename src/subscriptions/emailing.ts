import event from './eventEmitter';

event.on('some-event', () => {
  console.log('Send email from here');
});
