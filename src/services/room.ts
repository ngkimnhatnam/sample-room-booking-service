// Models import
import * as roomModel from '../models/room';

export const getAllRooms = async () => {
  try {
    const rooms = await roomModel.findAll();
    return {
      message: 'Rooms data retrieved successfully',
      status: 200,
      total_records: rooms.length,
      data: rooms,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};

export const getOneRoom = async (room_id: number) => {
  try {
    const room = await roomModel.findOne(room_id);
    return {
      message: 'Room data retrieved successfully',
      status: 200,
      data: room,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};
