// Dependencies import
import * as jwt from 'jsonwebtoken'

// Config import
import securityConfig from '../configs/security'

export const signNewJWT = (user_id: number): string => {
  const { jwt_token_secret, jwt_options } = securityConfig
  const payload = {
    user_id
  }

  return jwt.sign(
    payload,
    jwt_token_secret,
    jwt_options
  )
}