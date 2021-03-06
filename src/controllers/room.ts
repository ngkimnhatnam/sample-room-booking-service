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
  const { room_name, opening_hour, closing_hour, timezone, base_price } = req.body;
  const room_data = {
    room_name,
    opening_hour,
    closing_hour,
    timezone,
    base_price: Number(base_price),
  };

  try {
    const result = await roomService.handleAddingRoom(room_data);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  const room_id = Number(req.params.room_id);
  const room_data = req.body;

  try {
    const result = await roomService.handleUpdatingRoom(room_id, room_data);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  const room_id = Number(req.params.room_id);

  try {
    const result = await roomService.handleDeletingRoom(room_id);
    res.status(result.status).json({ ...result });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
};
