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
    const data = rooms.map((room) => {
      return {
        ...room,
        base_price: room.base_price / 100,
      };
    });
    return {
      message: 'Rooms data retrieved successfully',
      status: 200,
      total_records: data.length,
      data,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};

export const getOneRoom = async (room_id: number) => {
  try {
    const room = (await roomModel.findOne(room_id)) as FinalRoomData;
    room.base_price = room.base_price / 100;

    /* Room booking schedule is formatted here according to its timezone */
    room.bookings_formatted = room.bookings_timestamps.map((booking) => {
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

export const handleAddingRoom = async (room_data: {
  room_name: string;
  opening_hour: string;
  closing_hour: string;
  timezone: string;
  base_price: number;
}) => {
  try {
    const new_room_id = await roomModel.addOne(room_data);
    return {
      message: 'New room added successfully',
      status: 201,
      new_room_id,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};

export const handleUpdatingRoom = async (
  room_id: number,
  room_data: {
    room_name?: string;
    opening_hour?: string;
    closing_hour?: string;
    timezone?: string;
    base_price?: number;
  },
) => {
  try {
    /* If base price is provided then convert it to number */
    room_data.base_price && Number(room_data.base_price);

    await roomModel.updateOne(room_id, room_data);
    return {
      message: 'Room updated successfully',
      status: 200,
    };
  } catch (err) {
    throw { message: 'Something went wrong', status: 500 };
  }
};
