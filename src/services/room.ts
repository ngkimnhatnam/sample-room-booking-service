// Models import
import * as roomModel from '../models/room';

export const getAllRooms = async () => {
  try {
    const rooms = await roomModel.findAll();
    return {
      message: 'Rooms data retrieved successfully',
      status: 200,
      data: rooms,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};
