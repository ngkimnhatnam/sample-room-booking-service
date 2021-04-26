// Configs import
import SQL from '../configs/database';

// EventBus import
import eventBus from '../subscriptions/eventEmitter';

interface RoomDataShort {
  room_id: number;
  room_name: string;
  opening_hour: string;
  closing_hour: string;
  timezone: string;
  base_price: number;
  is_active: number;
  created_at: string;
}

export interface RoomDataLong extends RoomDataShort {
  bookings_timestamps: RoomBookings[];
}

export interface RoomBookings {
  booking_id: number;
  start_time: number;
  end_time: number;
}

export const findAll = (): Promise<RoomDataShort[]> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT * FROM rooms 
      WHERE is_active = ?`;
    const queryValues = [1];

    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res);
    });
  });
};

export const findOne = (room_id: number): Promise<RoomDataLong> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT * FROM rooms  
      WHERE room_id = ? AND is_active = ?`;
    const queryValues = [room_id, 1];

    SQL.query(sqlQuery, queryValues, async (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      res[0].bookings_timestamps = await findRoomIdAllBookings(room_id);
      resolve(res[0]);
    });
  });
};

const findRoomIdAllBookings = (room_id: number): Promise<RoomBookings[]> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT booking_id, start_time, end_time FROM bookings 
      WHERE room_id = ? AND end_time > UNIX_TIMESTAMP()`;
    const queryValues = [room_id];

    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res);
    });
  });
};
