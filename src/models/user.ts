// Configs import
import SQL from '../configs/database';

// EventBus import
import eventBus from '../subscriptions/eventEmitter';

export const createNewUserRecord = (email: string, password: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO users (email, password, created_at) 
      VALUES (?,?, now())`;

    const queryValues = [email, password];
    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res.insertId);
    });
  });
};

export const checkUserEmailExistence = (email: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT email FROM users 
      WHERE email = ?`;
    const queryValues = [email];
    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res);
    });
  });
};

export const createNewBooking = (
  user_id: number,
  room_id: number,
  start_time: number,
  end_time: number,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO bookings (user_id, room_id, start_time, end_time, created_at) 
      VALUES (?,?,?,?,now())`;
    const queryValues = [user_id, room_id, start_time, end_time];
    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res.insertId);
    });
  });
};

export const deleteUserRecord = (user_id: number) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `DELETE FROM users 
      WHERE user_id = ?`;
    const queryValues = [user_id];

    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res);
    });
  });
};

export const deleteUserBooking = (booking_id: number) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `DELETE FROM bookings 
      WHERE booking_id = ?`;
    const queryValues = [booking_id];

    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res);
    });
  });
};

export const findUserBookings = (
  user_id: number,
): Promise<{ booking_id: number; room_id: number; start_time: number; end_time: number }[]> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT booking_id, room_id, start_time, end_time FROM bookings 
      WHERE user_id = ?`;
    const queryValues = [user_id];

    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res);
    });
  });
};
