// Dependencies import
import { Request, Response } from 'express'

// Services import
import * as userService from '../services/user'

export const signup = async (req: Request, res: Response) => {

  const { email, password } = req.body
  try {
    const result = await userService.handleSignup(email, password)
    res.status(result.status).json({ ...result })
  } catch (err) {
    res.status(err.status).json({ message: err.message })
  }
}