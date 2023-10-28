import express from 'express'
import { confirmEmail, forgetPassword, logIn, register, resetPassword } from './auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { confirmValidation, forgetPasswordValidation, loginValidation, registerValidation, resetPasswordValidation } from './auth.validation.js'
const authRouter = express.Router()

authRouter.post('/register', validate(registerValidation), register)
authRouter.post('/logIn', validate(loginValidation), logIn)
authRouter.put('/confirmEmail', validate(confirmValidation), confirmEmail)
authRouter.put('/forgetPassword', validate(forgetPasswordValidation), forgetPassword)
authRouter.put('/resetPassword', validate(resetPasswordValidation), resetPassword)

export default authRouter
