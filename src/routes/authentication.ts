// Dependencies import
import express from 'express';

// Controller import
import * as authController from '../controllers/authentication';

const router = express.Router();

router.post('/login', authController.login);

export default router;
