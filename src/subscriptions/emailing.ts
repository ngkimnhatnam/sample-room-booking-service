import event from './eventEmitter';

event.on('send-confirm-email', () => {
  console.log('Sending email from favorite service provider');
});
