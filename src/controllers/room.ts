// Dependencies import
import { Request, Response } from 'express';

// Services import
import * as roomService from '../services/room';

//@ts-ignore
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await roomService.getAllRooms();
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};
