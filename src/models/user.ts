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

export const createNewBooking = (user_id: number) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT email FROM users 
      WHERE email = ?`;
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
