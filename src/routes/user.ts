// Dependencies import
import express from 'express';

// Controllers import
import * as userController from '../controllers/user';

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
 *               type: integer
 *               example: 201
 *             user_id:
 *               type: integer
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

export default router;
