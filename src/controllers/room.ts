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

export const getRoom = async (req: Request, res: Response): Promise<void> => {
  const room_id = Number(req.params.room_id);
  try {
    const result = await roomService.getOneRoom(room_id);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

export const addRoom = async (req: Request, res: Response): Promise<void> => {
  const { room_name, opening_hour, closing_hour, timezone } = req.body;
  const base_price = Number(req.body.base_price);
  try {
    const result = await roomService.handleAddingRoom(room_name, opening_hour, closing_hour, timezone, base_price);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};
