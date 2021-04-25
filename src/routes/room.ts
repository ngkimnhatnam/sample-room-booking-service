// Dependencies import
import express from 'express';

// Controllers import
import * as roomController from '../controllers/room';

const router = express.Router();

router.get('/rooms', roomController.getRooms);

export default router;
