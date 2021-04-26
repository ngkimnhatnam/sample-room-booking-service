// Dependencies import
import * as DateTimeConversion from 'luxon';

// Models import
import * as roomModel from '../models/room';

interface FinalRoomData extends roomModel.RoomDataLong {
  bookings_formatted: Array<{
    booking_id: number;
    start: string;
    end: string;
  }>;
}

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
    const room = (await roomModel.findOne(room_id)) as FinalRoomData;

    /* Room booking schedule is formatted here according to its timezone */
    room.bookings_formatted = room.bookings_raw.map((booking) => {
      const start = DateTimeConversion.DateTime.fromSeconds(booking.start_time, { zone: room.timezone });
      const end = DateTimeConversion.DateTime.fromSeconds(booking.end_time, { zone: room.timezone });

      return {
        booking_id: booking.booking_id,
        start: start.toFormat('dd-MM-yyyy HH:mm'),
        end: end.toFormat('dd-MM-yyyy HH:mm'),
      };
    });

    return {
      message: 'Room data retrieved successfully',
      status: 200,
      data: room,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};
