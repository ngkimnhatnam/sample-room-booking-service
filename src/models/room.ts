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
