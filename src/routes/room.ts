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

/**
 * @swagger
 * paths:
 *  /api/v1/rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     name: Add a new room
 *     summary: Add a new room
 *     description: "This API is used to add a new room to the system"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: "Data for new room to be added in the system"
 *         schema:
 *           type: object
 *           properties:
 *             room_name:
 *               type: string
 *               example: Casablanca
 *             opening_hour:
 *               type: string
 *               example: '08:00:00'
 *             closing_hour:
 *               type: string
 *               example: '18:00:00'
 *             timezone:
 *               type: string
 *               example: Africa/Casablanca
 *             base_price:
 *               type: number
 *               example: 4500
 *     responses:
 *       '201':
 *         description: Created
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: New room added successfully
 *             status:
 *               type: int
 *               example: 201
 *             new_room_id:
 *               type: int
 *               example: 25
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Something went wrong
 */
router.post('/rooms', roomController.addRoom);

/**
 * @swagger
 * paths:
 *  /api/v1/rooms/{room_id}:
 *   patch:
 *     tags:
 *       - Rooms
 *     name: Update an existing room
 *     summary: Update an existing room
 *     description: "This API is used to update an existing room's details in the system"
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
 *       - in: body
 *         name: body
 *         description: "Data for target room to be updated in the system"
 *         schema:
 *           type: object
 *           properties:
 *             room_name:
 *               type: string
 *               example: Casablanca
 *             opening_hour:
 *               type: string
 *               example: '08:00:00'
 *             closing_hour:
 *               type: string
 *               example: '18:00:00'
 *             timezone:
 *               type: string
 *               example: Africa/Casablanca
 *             base_price:
 *               type: number
 *               example: 4500
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Room updated successfully
 *             status:
 *               type: int
 *               example: 200
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Something went wrong
 */
router.patch('/rooms/:room_id', roomController.updateRoom);

/**
 * @swagger
 * paths:
 *  /api/v1/rooms/{room_id}:
 *   delete:
 *     tags:
 *       - Rooms
 *     name: Delete an existing room
 *     summary: Delete an existing room
 *     description: "This API is used to delete an existing room in the system"
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
 *               example: Room deleted successfully
 *             status:
 *               type: int
 *               example: 200
 *       '400':
 *         description: Bad request
 *         schema:
 *           type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Cannot delete a room which has bookings
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Something went wrong
 */
router.delete('/rooms/:room_id', roomController.deleteRoom);

export default router;
