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
 *                     example: 10
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

/**
 * @swagger
 * paths:
 *  /api/v1/rooms/{room_id}:
 *   get:
 *     tags:
 *       - Rooms
 *     name: Get a specific room
 *     summary: Get a specific room
 *     description: "This API is used to retrieve data from a specific room with provided id"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: room_id
 *         description: "Room Id to be identified in the system"
 *         schema:
 *           type: int
 *           example: 5
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Room data retrieved successfully
 *             status:
 *               type: int
 *               example: 200
 *             data:
 *               type: object
 *               properties:
 *                 room_id:
 *                   type: int
 *                   example: 1
 *                 room_name:
 *                   type: string
 *                   example: 'Sauna'
 *                 opening_hour:
 *                   type: string
 *                   example: '08:00:00'
 *                 closing_hour:
 *                   type: string
 *                   example: '17:00:00'
 *                 base_price:
 *                   type: int
 *                   example: 10
 *                 timezone:
 *                   type: string
 *                   example: Europe/Helsinki
 *                 is_active:
 *                   type: int
 *                   example: 1
 *                 bookings_raw:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       booking_id:
 *                         type: int
 *                         example: 1
 *                       start_time:
 *                         type: int
 *                         example: 16032131
 *                       end_time:
 *                         type: int
 *                         example: 16042323
 *                 bookings_formatted:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       booking_id:
 *                         type: int
 *                         example: 1
 *                       start:
 *                         type: string
 *                         example: '26-04-2021 12:00'
 *                       end:
 *                         type: string
 *                         example: '26-04-2021 15:00'
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Something went wrong
 */
router.get('/rooms/:room_id', roomController.getRoom);

router.post('/rooms', roomController.addRoom);

router.patch('/rooms/:room_id', roomController.updateRoom);

export default router;
