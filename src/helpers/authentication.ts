import { pbkdf2 } from 'crypto'

export const createPasswordHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {

    pbkdf2(password, 'yourGeneratedSaltHere', 10000, 64, 'sha512', (err, hashBuffer) => {
      if (err) reject(err)
      resolve(hashBuffer.toString('hex'))
    });
  })
}
