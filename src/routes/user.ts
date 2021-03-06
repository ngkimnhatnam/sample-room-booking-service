// Dependencies import
import express from 'express';

// Controllers import
import * as userController from '../controllers/user';

// Middlewares import
import { authenticateJWT } from '../middlewares/authentication';

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     name: Register A User
 *     summary: Register A New User
 *     description: "This API is used to register a new user into the system"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: "User Data Payload"
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: random@email.fi
 *             password:
 *               type: string
 *               example: thisisnotapassword
 *         required: true
 *     responses:
 *       '201':
 *         description: Created
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User account created success
 *             status:
 *               type: int
 *               example: 201
 *             user_id:
 *               type: int
 *               example: 10
 *       '400':
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Email already exists
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Something went wrong
 */
router.post('/users', userController.signup);

/**
 * @swagger
 * paths:
 *  /api/v1/users/{user_id}/bookings:
 *   post:
 *     tags:
 *       - Users
 *     name: Book a room
 *     summary: Book a room
 *     description: "This API is used for a user to book a room"
 *     security:
 *       - Bearer: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: "User Id to be identified in the system"
 *         schema:
 *           type: int
 *           example: 5
 *         required: true
 *       - in: body
 *         name: body
 *         description: "User Data Payload"
 *         schema:
 *           type: object
 *           properties:
 *             room_id:
 *               type: int
 *               example: 1
 *             booking_start:
 *               type: string
 *               example: '2021-04-28T10:00:00'
 *             booking_end:
 *               type: string
 *               example: '2021-04-28T12:00:00'
 *         required: true
 *     responses:
 *       '201':
 *         description: Created
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Booking created successfully
 *             status:
 *               type: int
 *               example: 201
 *             booking_id:
 *               type: int
 *               example: 10
 *             amount_paid:
 *               type: string
 *               example: '22.73???'
 *       '400':
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Booking has overlapping reservations
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Something went wrong
 */
router.post('/users/:user_id/bookings', authenticateJWT, userController.bookRoom);

/**
 * @swagger
 * paths:
 *  /api/v1/users/{user_id}/bookings:
 *   get:
 *     tags:
 *       - Users
 *     name: Get bookings
 *     summary: Get bookings
 *     description: "This API is used for a user to retrieve his/her upcoming bookings"
 *     security:
 *       - Bearer: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: "User Id to be identified in the system"
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
 *               example: User bookings listed successfully
 *             status:
 *               type: int
 *               example: 200
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: int
 *                     example: 1
 *                   room_id:
 *                     type: int
 *                     example: 1
 *                   timezone:
 *                     type: string
 *                     example: 'Europe/Helsinki'
 *                   start:
 *                     type: string
 *                     example: '26-04-2021 15:00'
 *                   end:
 *                     type: string
 *                     example: '26-04-2021 17:00'
 *                   amount_paid:
 *                     type: string
 *                     example: '22.73???'
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Something went wrong
 */
router.get('/users/:user_id/bookings', authenticateJWT, userController.getBookings);

export default router;
