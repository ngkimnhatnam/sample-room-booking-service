// EventBus import
import event from './eventEmitter';

// Configs import
import logger from '../configs/logger';

/* General database error logging */
event.on('database-error', (err) => {
  const info = {
    level: 'error',
    subject: 'Database error',
    message: err,
  };
  logger(info);
});

/* Sign up error */
event.on('signup-error', (err, email) => {
  const info = {
    level: 'error',
    subject: 'Error during signup process',
    message: `Error: ${JSON.stringify(err)} | Email: ${email}`,
  };
  logger(info);
});

/* Sign up success */
event.on('signup-success', (email) => {
  const info = {
    level: 'info',
    subject: 'New signup',
    message: `Email: ${email}`,
  };
  logger(info);
});

/* Login success */
event.on('login-success', (user_id, email) => {
  const info = {
    level: 'info',
    subject: 'User logged in',
    message: `User: ${user_id} | Email: ${email}`,
  };
  logger(info);
});

/* Login error */
event.on('login-failure', (err, email) => {
  const info = {
    level: 'error',
    subject: 'Error during login process',
    message: `Error: ${JSON.stringify(err)} | Email: ${email}`,
  };
  logger(info);
});
