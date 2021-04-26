// Dependencies import
import express from 'express';

// Controller import
import * as authController from '../controllers/authentication';

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/v1/login:
 *   post:
 *     tags:
 *       - Authentication
 *     name: Login
 *     summary: Login
 *     description: "This API is used for a user to login into the system"
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
 *       '200':
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User logged in successfully
 *             status:
 *               type: int
 *               example: 200
 *             user_id:
 *               type: int
 *               example: 10
 *             access_token:
 *               type: string
 *               example: ey9328jof392tfh04fj2390jf0239f
 *       '401':
 *         description: Not authorized
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Email or password incorrect
 *       '500':
 *         description: Internal error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Something went wrong
 */
router.post('/login', authController.login);

export default router;
