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
  amount_paid: number,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO bookings 
      (user_id, room_id, start_time, end_time, amount_paid, created_at) 
      VALUES (?,?,?,?,?,now())`;
    const queryValues = [user_id, room_id, start_time, end_time, amount_paid];
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
): Promise<
  {
    booking_id: number;
    room_id: number;
    start_time: number;
    end_time: number;
    amount_paid: number;
    timezone: string;
  }[]
> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT bk.booking_id, bk.room_id, bk.start_time, bk.end_time, bk.amount_paid, rm.timezone 
      FROM bookings as bk 
      LEFT JOIN rooms as rm ON rm.room_id = bk.room_id 
      WHERE user_id = ? AND bk.end_time > UNIX_TIMESTAMP()`;
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

export const findUserStripeId = (user_id: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT stripe_id FROM users 
      WHERE user_id = ?`;
    const queryValues = [user_id];
    SQL.query(sqlQuery, queryValues, (err, res) => {
      if (err) {
        eventBus.emit('database-error', err);
        reject(err);
      }
      resolve(res[0].stripe_id);
    });
  });
};
