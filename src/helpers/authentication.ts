import { pbkdf2 } from 'crypto'
import securityConfig from '../configs/security'

export const createPasswordHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { hash_salt, iterations, hash_length, hash_digest } = securityConfig

    pbkdf2(password, hash_salt, iterations, hash_length, hash_digest, (err, hashBuffer) => {
      if (err) reject(err)
      resolve(hashBuffer.toString('hex'))
    });
  })
}
