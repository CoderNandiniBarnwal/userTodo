import express from 'express'
import { register } from '../controller/userController.js'

const userRoute = express.Router()

userRoute.post('/register', register)

export default userRoute