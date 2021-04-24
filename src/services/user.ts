// Helpers import
import * as authenticationHelper from '../helpers/authentication'
import * as jwt from '../helpers/jwt'

// Models import
import * as userModel from '../models/user'

// EventBus import
import eventBus from '../subscriptions/eventEmitter'

export const handleSignup = async (email: string, password: string) => {
  try {
    const emailCheck = await userModel.checkUserEmailExistence(email)
    if (emailCheck.length !== 0) {
      throw ({ message: 'Email existed', status: 400 })
    }

    const hashedPass = await authenticationHelper.createPasswordHash(password)
    const user_id = await userModel.createNewUserRecord(email, hashedPass)
    const accessToken = jwt.signNewJWT(user_id)

    eventBus.emit('signup-success', email)
    return ({
      message: 'User signup success',
      status: 201,
      user_id,
      accessToken
    })
  } catch (err) {
    eventBus.emit('signup-error', err, email)
    if (err.status) {
      throw ({ message: err.message, status: err.status })
    }
    throw ({ message: 'Something went wrong', status: 500 })
  }
}