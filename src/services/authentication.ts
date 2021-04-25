// Helpers import
import * as authenticationHelper from '../helpers/authentication';
import * as jwt from '../helpers/jwt';

// Models import
import * as authModel from '../models/authentication';

// EventBus import
import eventBus from '../subscriptions/eventEmitter';

export const handleLogin = async (email: string, password: string) => {
  try {
    const result = await authModel.getUserHashedPassword(email);
    if (result.length === 0) {
      throw { message: 'Email or password incorrect', status: 401 };
    }

    const { user_id, hashed_password } = result[0];
    const passwordCheck = await authenticationHelper.validatePasswordHash(password, hashed_password);
    if (!passwordCheck) {
      throw { message: 'Email or password incorrect', status: 401 };
    }

    const access_token = jwt.signNewJWT(user_id);

    eventBus.emit('login-success', user_id, email);
    return {
      message: 'User logged in successfully',
      status: 200,
      user_id: user_id,
      access_token,
    };
  } catch (err) {
    console.log('Err', err);
    eventBus.emit('login-failure', err, email);
    if (err.status) {
      throw { message: err.message, status: err.status };
    }
    throw { message: 'Something went wrong', status: 500 };
  }
};
