// Dependencies import
import express from 'express'

// Controllers import
import * as userController from '../controllers/user'

const router = express.Router()

router.post('/users', userController.signup)

export default router