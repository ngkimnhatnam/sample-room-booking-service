// Dependencies import
import express from 'express';

// Controllers import
import * as roomController from '../controllers/room';

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/v1/rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     name: Get all rooms
 *     summary: Get all active rooms
 *     description: "This API is used to retrieve all currently active rooms"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Rooms data retrieved successfully
 *             status:
 *               type: int
 *               example: 200
 *             total_records:
 *               type: int
 *               example: 12
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room_id:
 *                     type: int
 *                     example: 1
 *                   room_name:
 *                     type: string
 *                     example: 'Sauna'
 *                   opening_hour:
 *                     type: string
 *                     example: '08:00:00'
 *                   closing_hour:
 *                     type: string
 *                     example: '17:00:00'
 *                   base_price:
 *                     type: int
 *                     example: 1000
 *                   timezone:
 *                     type: string
 *                     example: Europe/Helsinki
 *                   is_active:
 *                     type: int
 *                     example: 1
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Something went wrong
 */
router.get('/rooms', roomController.getRooms);

export default router;
