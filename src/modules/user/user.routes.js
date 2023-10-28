import express from 'express'
import { protectedRoutes } from '../../middleware/protectedRoutes.js'
import { confirmNewEmail, coverImages, getProfile, profileImage, softDeleteProfile, updatePassword, updateProfile } from './user.controller.js'
import { fileUpload, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { confirmValidation, updatePasswordValidation, updateProfileValidation } from './user.validation.js'

const userRouter = express.Router()

userRouter.route('/')
    .get(protectedRoutes, getProfile)
    .put(protectedRoutes,validate(updateProfileValidation), updateProfile)

userRouter.patch('/confirm', protectedRoutes,validate(confirmValidation), confirmNewEmail)
userRouter.patch('/updatePassword', protectedRoutes,validate(updatePasswordValidation), updatePassword)
userRouter.delete('/softDelete', protectedRoutes, softDeleteProfile)
userRouter.patch('/profileImage', protectedRoutes, fileUpload(fileValidation.image).single('image'), profileImage)
userRouter.patch('/coverImages', protectedRoutes, fileUpload(fileValidation.image).array('images'), coverImages)

export default userRouter
