// Configs import
import SQL from '../configs/database';

// EventBus import
import eventBus from '../subscriptions/eventEmitter';

export const getUserHashedPassword = (email: string): Promise<{ user_id: number; hashed_password: string }[]> => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT user_id, password as hashed_password FROM users 
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
