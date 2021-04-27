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

export const addOne = (room_data: {
  room_name: string;
  opening_hour: string;
  closing_hour: string;
  timezone: string;
  base_price: number;
}): Promise<number> => {
  return new Promise((resolve, reject) => {
    const { room_name, opening_hour, closing_hour, timezone, base_price } = room_data;
    const sqlQuery = `INSERT INTO rooms 
      (room_name, opening_hour, closing_hour, timezone, base_price, created_at) 
      VALUES (?,?,?,?,?, now())`;
    const queryValues = [room_name, opening_hour, closing_hour, timezone, base_price];

    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res.insertId);
    });
  });
};

export const updateOne = (
  room_id: number,
  room_data: {
    room_name?: string;
    opening_hour?: string;
    closing_hour?: string;
    timezone?: string;
    base_price?: number;
  },
) => {
  return new Promise((resolve, reject) => {
    const queryValues: any[] = [];
    let queryCondition = '';

    // This function maps out the room data into [ [key, value] ] format
    const mappedRoomData: any[] = Object.entries(room_data);

    // This block loops through mapped object and adds existent values into query string & query value array
    for (const [key, value] of mappedRoomData) {
      queryCondition = queryValues.length === 0 ? queryCondition + `${key}= ?` : queryCondition + `, ${key}= ?`;
      queryValues.push(value);
    }

    // This adds room id into where condition
    queryValues.push(room_id);
    const baseQuery = `UPDATE rooms SET ${queryCondition} WHERE room_id= ?`;

    SQL.query(baseQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      } else {
        resolve(res.changedRows);
      }
    });
  });
};

export const deleteOne = (room_id: number) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `DELETE FROM rooms 
      WHERE room_id = ?`;
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
