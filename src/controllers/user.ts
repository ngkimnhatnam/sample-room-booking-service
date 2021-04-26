// Dependencies import
import { Request, Response } from 'express';

// Services import
import * as userService from '../services/user';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const result = await userService.handleSignup(email, password);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

export const bookRoom = async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  const user_payload = {
    room_id: Number(req.body.room_id),
    booking_start: req.body.booking_start,
    booking_end: req.body.booking_end,
  };

  try {
    const result = await userService.handleBooking(user_id, user_payload);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};
